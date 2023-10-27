import MetaTags from '@components/Common/MetaTags'
import useEthersWalletClient from '@hooks/useEthersWalletClient'
import useHandleWrongNetwork from '@hooks/useHandleWrongNetwork'
import type { MetadataAttribute, VideoOptions } from '@lens-protocol/metadata'
import {
  MediaVideoMimeType,
  MetadataAttributeType,
  MetadataLicenseType,
  PublicationContentWarning,
  shortVideo,
  video
} from '@lens-protocol/metadata'
import { getCollectModuleInput } from '@lib/getCollectModuleInput'
import useAppStore, { UPLOADED_VIDEO_FORM_DEFAULTS } from '@lib/store'
import useNonceStore from '@lib/store/nonce'
import usePersistStore from '@lib/store/persist'
import { useProfileStore } from '@lib/store/profile'
import { LENSHUB_PROXY_ABI } from '@tape.xyz/abis'
import { getUserLocale, uploadToIPFS } from '@tape.xyz/browser'
import {
  ERROR_MESSAGE,
  IRYS_CONNECT_MESSAGE,
  LENSHUB_PROXY_ADDRESS,
  REQUESTING_SIGNATURE_MESSAGE,
  TAPE_APP_ID,
  TAPE_APP_NAME,
  TAPE_WEBSITE_URL
} from '@tape.xyz/constants'
import {
  canUploadedToIpfs,
  EVENTS,
  getProfile,
  getSignature,
  logger,
  Tower,
  trimify,
  uploadToAr
} from '@tape.xyz/generic'
import type {
  CreateMomokaPostEip712TypedData,
  CreateOnchainPostEip712TypedData,
  Profile,
  ReferenceModuleInput
} from '@tape.xyz/lens'
import {
  ReferenceModuleType,
  useBroadcastOnchainMutation,
  useBroadcastOnMomokaMutation,
  useCreateMomokaPostTypedDataMutation,
  useCreateOnchainPostTypedDataMutation,
  usePostOnchainMutation,
  usePostOnMomokaMutation
} from '@tape.xyz/lens'
import type { CustomErrorWithData } from '@tape.xyz/lens/custom-types'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import toast from 'react-hot-toast'
import { v4 as uuidv4 } from 'uuid'
import { useAccount, useContractWrite, useSignTypedData } from 'wagmi'

import type { VideoFormData } from './Details'
import Details from './Details'

const CreateSteps = () => {
  const getIrysInstance = useAppStore((state) => state.getIrysInstance)
  const setIrysData = useAppStore((state) => state.setIrysData)
  const irysData = useAppStore((state) => state.irysData)
  const uploadedVideo = useAppStore((state) => state.uploadedVideo)
  const setUploadedVideo = useAppStore((state) => state.setUploadedVideo)
  const activeProfile = useProfileStore(
    (state) => state.activeProfile
  ) as Profile

  const { lensHubOnchainSigNonce, setLensHubOnchainSigNonce } = useNonceStore()
  const { queuedVideos, setQueuedVideos } = usePersistStore()
  const { address } = useAccount()
  const { data: signer } = useEthersWalletClient()
  const router = useRouter()
  const handleWrongNetwork = useHandleWrongNetwork()

  const degreesOfSeparation = uploadedVideo.referenceModule
    ?.degreesOfSeparationReferenceModule?.degreesOfSeparation as number
  const enabledReferenceModule = uploadedVideo.referenceModule
    ?.degreesOfSeparationReferenceModule
    ? ReferenceModuleType.DegreesOfSeparationReferenceModule
    : uploadedVideo.referenceModule.followerOnlyReferenceModule
    ? ReferenceModuleType.FollowerOnlyReferenceModule
    : null

  const canUseRelay = activeProfile?.signless && activeProfile?.sponsor

  const resetToDefaults = () => {
    setUploadedVideo(UPLOADED_VIDEO_FORM_DEFAULTS)
  }

  const redirectToChannelPage = () => {
    resetToDefaults()
    router.push(
      uploadedVideo.isByteVideo
        ? `/u/${getProfile(activeProfile)?.slug}?tab=bytes`
        : `/u/${getProfile(activeProfile)?.slug}`
    )
  }

  const redirectToWatchPage = (videoId: string) => {
    resetToDefaults()
    router.push(`/watch/${videoId}`)
  }

  const setToQueue = (txn: { txnId?: string; txnHash?: string }) => {
    if (txn?.txnId) {
      setQueuedVideos([
        {
          thumbnailUrl: uploadedVideo.thumbnail,
          title: uploadedVideo.title,
          txnId: txn.txnId,
          txnHash: txn.txnHash
        },
        ...(queuedVideos || [])
      ])
    }
    redirectToChannelPage()
  }

  useEffect(() => {
    Tower.track(EVENTS.PAGEVIEW, { page: EVENTS.PAGE_VIEW.UPLOAD.STEPS })
  }, [])

  useEffect(() => {
    if (handleWrongNetwork()) {
      return
    }
  }, [handleWrongNetwork])

  const stopLoading = () => {
    setUploadedVideo({
      buttonText: 'Post Now',
      loading: false
    })
  }

  const onError = (error: CustomErrorWithData) => {
    toast.error(error?.data?.message ?? error?.message ?? ERROR_MESSAGE)
    stopLoading()
  }

  const onCompleted = (__typename?: 'RelayError' | 'RelaySuccess') => {
    if (__typename === 'RelayError') {
      return
    }
    Tower.track(EVENTS.PUBLICATION.NEW_POST, {
      video_format: uploadedVideo.mediaType,
      video_type: uploadedVideo.isByteVideo ? 'SHORT_FORM' : 'LONG_FORM',
      publication_state: uploadedVideo.collectModule.isRevertCollect
        ? 'MOMOKA'
        : 'ON_CHAIN',
      video_storage: uploadedVideo.isUploadToIpfs ? 'IPFS' : 'ARWEAVE',
      publication_collect_module: Object.keys(
        getCollectModuleInput(uploadedVideo.collectModule)
      )[0],
      publication_reference_module: enabledReferenceModule,
      publication_reference_module_degrees_of_separation: uploadedVideo
        .referenceModule.degreesOfSeparationReferenceModule
        ? degreesOfSeparation
        : null,
      user_id: activeProfile?.id
    })
    return stopLoading()
  }

  const initIrys = async () => {
    if (signer && address && !irysData.instance) {
      toast.loading(IRYS_CONNECT_MESSAGE)
      const instance = await getIrysInstance(signer)
      if (instance) {
        setIrysData({ instance })
      }
    }
  }

  const { signTypedDataAsync } = useSignTypedData({
    onError
  })

  const { write } = useContractWrite({
    address: LENSHUB_PROXY_ADDRESS,
    abi: LENSHUB_PROXY_ABI,
    functionName: 'post',
    onSuccess: (data) => {
      stopLoading()
      setLensHubOnchainSigNonce(lensHubOnchainSigNonce + 1)
      if (data.hash) {
        setToQueue({ txnHash: data.hash })
      }
    },
    onError: (error) => {
      onError(error)
      setLensHubOnchainSigNonce(lensHubOnchainSigNonce - 1)
    }
  })

  const getSignatureFromTypedData = async (
    data: CreateMomokaPostEip712TypedData | CreateOnchainPostEip712TypedData
  ) => {
    toast.loading(REQUESTING_SIGNATURE_MESSAGE)
    const signature = await signTypedDataAsync(getSignature(data))
    return signature
  }

  const [broadcastOnchain] = useBroadcastOnchainMutation({
    onCompleted: ({ broadcastOnchain }) => {
      onCompleted(broadcastOnchain.__typename)
      if (broadcastOnchain.__typename === 'RelaySuccess') {
        const txnId = broadcastOnchain?.txId
        setToQueue({ txnId })
      }
    }
  })

  const [broadcastOnMomoka] = useBroadcastOnMomokaMutation({
    onCompleted: ({ broadcastOnMomoka }) => {
      if (broadcastOnMomoka.__typename === 'CreateMomokaPublicationResult') {
        redirectToWatchPage(broadcastOnMomoka?.id)
      }
    }
  })

  const [createOnchainPostTypedData] = useCreateOnchainPostTypedDataMutation({
    onCompleted: async ({ createOnchainPostTypedData }) => {
      const { typedData, id } = createOnchainPostTypedData
      try {
        const signature = await getSignatureFromTypedData(typedData)
        const { data } = await broadcastOnchain({
          variables: { request: { id, signature } }
        })
        if (data?.broadcastOnchain?.__typename === 'RelayError') {
          return write?.({ args: [typedData.value] })
        }
      } catch {}
    },
    onError
  })

  const [postOnchain] = usePostOnchainMutation({
    onError,
    onCompleted: ({ postOnchain }) => {
      if (postOnchain.__typename === 'RelaySuccess') {
        onCompleted(postOnchain.__typename)
        setToQueue({ txnId: postOnchain.txId })
      }
    }
  })

  const [createMomokaPostTypedData] = useCreateMomokaPostTypedDataMutation({
    onCompleted: async ({ createMomokaPostTypedData }) => {
      const { typedData, id } = createMomokaPostTypedData
      try {
        const signature = await getSignatureFromTypedData(typedData)
        const { data } = await broadcastOnMomoka({
          variables: { request: { id, signature } }
        })
        if (data?.broadcastOnMomoka?.__typename === 'RelayError') {
          return write?.({ args: [typedData.value] })
        }
      } catch {}
    },
    onError
  })

  const [postOnMomoka] = usePostOnMomokaMutation({
    onError,
    onCompleted: ({ postOnMomoka }) => {
      if (postOnMomoka.__typename === 'CreateMomokaPublicationResult') {
        redirectToWatchPage(postOnMomoka.id)
      }
    }
  })

  const createPublication = async ({
    videoSource
  }: {
    videoSource: string
  }) => {
    try {
      setUploadedVideo({
        buttonText: 'Storing metadata',
        loading: true
      })
      uploadedVideo.videoSource = videoSource
      const attributes: MetadataAttribute[] = [
        {
          type: MetadataAttributeType.STRING,
          key: 'category',
          value: uploadedVideo.videoCategory.tag
        },
        {
          type: MetadataAttributeType.STRING,
          key: 'creator',
          value: `${getProfile(activeProfile)?.slug}`
        },
        {
          type: MetadataAttributeType.STRING,
          key: 'app',
          value: TAPE_WEBSITE_URL
        }
      ]

      const publicationMetadata: VideoOptions = {
        video: {
          item: uploadedVideo.videoSource,
          type: MediaVideoMimeType.MP4,
          altTag: trimify(uploadedVideo.title),
          attributes,
          cover: uploadedVideo.thumbnail,
          duration: uploadedVideo.durationInSeconds,
          license: MetadataLicenseType.CCO
        },
        appId: TAPE_APP_ID,
        id: uuidv4(),
        attributes,
        content: trimify(uploadedVideo.description),
        tags: [uploadedVideo.videoCategory.tag],
        locale: getUserLocale(),
        title: uploadedVideo.title,
        marketplace: {
          attributes,
          animation_url: uploadedVideo.videoSource,
          external_url: `${TAPE_WEBSITE_URL}/u/${getProfile(activeProfile)
            ?.slug}`,
          image: uploadedVideo.thumbnail,
          name: uploadedVideo.title,
          description: trimify(uploadedVideo.description)
        }
      }

      if (uploadedVideo.isSensitiveContent) {
        publicationMetadata.contentWarning = PublicationContentWarning.SENSITIVE
      }

      const shortVideoMetadata = shortVideo(publicationMetadata)
      const longVideoMetadata = video(publicationMetadata)
      const metadataUri = await uploadToAr(
        uploadedVideo.isByteVideo ? shortVideoMetadata : longVideoMetadata
      )
      setUploadedVideo({
        buttonText: 'Posting...',
        loading: true
      })

      const isRestricted = Boolean(degreesOfSeparation)
      const referenceModuleDegrees = {
        commentsRestricted: isRestricted,
        mirrorsRestricted: isRestricted,
        degreesOfSeparation: degreesOfSeparation ?? 0,
        quotesRestricted: isRestricted
      }

      const { isRevertCollect } = uploadedVideo.collectModule

      if (isRevertCollect) {
        // MOMOKA
        if (canUseRelay) {
          return await postOnMomoka({
            variables: {
              request: {
                contentURI: metadataUri
              }
            }
          })
        } else {
          return await createMomokaPostTypedData({
            variables: {
              request: {
                contentURI: metadataUri
              }
            }
          })
        }
      }

      // ON-CHAIN
      const referenceModule: ReferenceModuleInput = {
        degreesOfSeparationReferenceModule: {
          ...referenceModuleDegrees
        }
      }
      if (uploadedVideo.referenceModule?.followerOnlyReferenceModule) {
        referenceModule.followerOnlyReferenceModule =
          uploadedVideo.referenceModule?.followerOnlyReferenceModule
      }
      const request = {
        contentURI: metadataUri,
        openActionModules: [
          {
            ...getCollectModuleInput(uploadedVideo.collectModule)
          }
        ],
        referenceModule
      }
      if (canUseRelay) {
        return await postOnchain({
          variables: { request }
        })
      } else {
        return await createOnchainPostTypedData({
          variables: {
            options: { overrideSigNonce: lensHubOnchainSigNonce },
            request
          }
        })
      }
    } catch (error) {
      console.log('🚀 ~ Create ~ error:', error)
    }
  }

  const uploadVideoToIpfs = async () => {
    const result = await uploadToIPFS(
      uploadedVideo.file as File,
      (percentCompleted) => {
        setUploadedVideo({
          buttonText: 'Uploading...',
          loading: true,
          percent: percentCompleted
        })
      }
    )
    if (!result.url) {
      stopLoading()
      return toast.error('IPFS Upload failed')
    }
    setUploadedVideo({
      percent: 100,
      videoSource: result.url
    })
    return await createPublication({
      videoSource: result.url
    })
  }

  const uploadToIrys = async () => {
    if (!irysData.instance) {
      stopLoading()
      return await initIrys()
    }
    if (!uploadedVideo.stream) {
      stopLoading()
      return toast.error('Media not uploaded correctly')
    }
    if (parseFloat(irysData.balance) < parseFloat(irysData.estimatedPrice)) {
      stopLoading()
      return toast.error('Insufficient storage balance')
    }
    try {
      setUploadedVideo({
        loading: true,
        buttonText: 'Uploading...'
      })
      const instance = irysData.instance
      const tags = [
        { name: 'Content-Type', value: uploadedVideo.mediaType },
        { name: 'App-Name', value: TAPE_APP_NAME },
        { name: 'Profile-Id', value: activeProfile?.id },
        // ANS-110 standard
        { name: 'Title', value: trimify(uploadedVideo.title) },
        { name: 'Type', value: uploadedVideo.type.toLowerCase() },
        { name: 'Topic', value: uploadedVideo.videoCategory.name },
        {
          name: 'Description',
          value: trimify(uploadedVideo.description)
        }
      ]
      const fileSize = uploadedVideo?.file?.size as number
      const uploader = instance.uploader.chunkedUploader
      const chunkSize = 10000000 // 10 MB
      uploader.setChunkSize(chunkSize)
      if (fileSize < chunkSize) {
        toast.loading(REQUESTING_SIGNATURE_MESSAGE, { duration: 8000 })
      }
      uploader.on('chunkUpload', (chunkInfo) => {
        const expectedChunks = Math.floor(fileSize / chunkSize)
        if (expectedChunks === chunkInfo.id) {
          toast.loading(REQUESTING_SIGNATURE_MESSAGE, { duration: 8000 })
        }
        const percentCompleted = Math.round(
          (chunkInfo.totalUploaded * 100) / fileSize
        )
        setUploadedVideo({
          loading: true,
          percent: percentCompleted
        })
      })
      const upload = uploader.uploadData(uploadedVideo.stream as any, {
        tags
      })
      const response = await upload
      setUploadedVideo({
        loading: false,
        videoSource: `ar://${response.data.id}`
      })
      return await createPublication({
        videoSource: `ar://${response.data.id}`
      })
    } catch (error) {
      toast.error('Failed to upload media to Arweave')
      logger.error('[Error Irys Upload Media]', error)
      return stopLoading()
    }
  }

  const onUpload = async (data: VideoFormData) => {
    uploadedVideo.title = data.title
    uploadedVideo.loading = true
    uploadedVideo.description = data.description
    uploadedVideo.isSensitiveContent = data.isSensitiveContent
    setUploadedVideo({ ...uploadedVideo })
    // Upload video directly from source without uploading again
    if (
      uploadedVideo.videoSource.length &&
      (uploadedVideo.videoSource.includes('ar://') ||
        uploadedVideo.videoSource.includes('ipfs://'))
    ) {
      return await createPublication({
        videoSource: uploadedVideo.videoSource
      })
    }
    if (
      canUploadedToIpfs(uploadedVideo.file?.size) &&
      uploadedVideo.isUploadToIpfs
    ) {
      return await uploadVideoToIpfs()
    } else {
      await uploadToIrys()
    }
  }

  return (
    <div className="mx-auto my-10 gap-5">
      <MetaTags title="Create" />
      <div className="container mx-auto mt-10 max-w-screen-xl">
        <Details onCancel={resetToDefaults} onUpload={onUpload} />
      </div>
    </div>
  )
}

export default CreateSteps
