import { LENSHUB_PROXY_ABI } from '@abis/LensHubProxy'
import MetaTags from '@components/Common/MetaTags'
import useEthersWalletClient from '@hooks/useEthersWalletClient'
import type { MetadataAttribute, VideoOptions } from '@lens-protocol/metadata'
import {
  MediaVideoMimeType,
  MetadataAttributeType,
  MetadataLicenseType,
  PublicationContentWarning,
  shortVideo,
  video
} from '@lens-protocol/metadata'
import {
  Analytics,
  getUserLocale,
  TRACK,
  uploadToIPFS
} from '@lenstube/browser'
import {
  BUNDLR_CONNECT_MESSAGE,
  ERROR_MESSAGE,
  LENSHUB_PROXY_ADDRESS,
  LENSTUBE_APP_ID,
  LENSTUBE_APP_NAME,
  LENSTUBE_WEBSITE_URL,
  REQUESTING_SIGNATURE_MESSAGE
} from '@lenstube/constants'
import {
  canUploadedToIpfs,
  getCollectModule,
  getSignature,
  logger,
  trimify,
  trimLensHandle,
  uploadToAr
} from '@lenstube/generic'
import type {
  CreateMomokaPostEip712TypedData,
  CreateOnchainPostEip712TypedData,
  ReferenceModuleInput
} from '@lenstube/lens'
import {
  ReferenceModuleType,
  useBroadcastOnchainMutation,
  useBroadcastOnMomokaMutation,
  useCreateMomokaPostTypedDataMutation,
  useCreateOnchainPostTypedDataMutation,
  usePostOnchainMutation,
  usePostOnMomokaMutation
} from '@lenstube/lens'
import type { CustomErrorWithData } from '@lenstube/lens/custom-types'
import useAppStore, { UPLOADED_VIDEO_FORM_DEFAULTS } from '@lib/store'
import useChannelStore from '@lib/store/channel'
import usePersistStore from '@lib/store/persist'
import { t } from '@lingui/macro'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import toast from 'react-hot-toast'
import { v4 as uuidv4 } from 'uuid'
import { useAccount, useContractWrite, useSignTypedData } from 'wagmi'

import type { VideoFormData } from './Details'
import Details from './Details'

const UploadSteps = () => {
  const getBundlrInstance = useAppStore((state) => state.getBundlrInstance)
  const setBundlrData = useAppStore((state) => state.setBundlrData)
  const bundlrData = useAppStore((state) => state.bundlrData)
  const uploadedVideo = useAppStore((state) => state.uploadedVideo)
  const setUploadedVideo = useAppStore((state) => state.setUploadedVideo)
  const activeChannel = useChannelStore((state) => state.activeChannel)

  const queuedVideos = usePersistStore((state) => state.queuedVideos)
  const setQueuedVideos = usePersistStore((state) => state.setQueuedVideos)
  const { address } = useAccount()
  const { data: signer } = useEthersWalletClient()
  const router = useRouter()

  const degreesOfSeparation = uploadedVideo.referenceModule
    ?.degreesOfSeparationReferenceModule?.degreesOfSeparation as number
  const enabledReferenceModule = uploadedVideo.referenceModule
    ?.degreesOfSeparationReferenceModule
    ? ReferenceModuleType.DegreesOfSeparationReferenceModule
    : uploadedVideo.referenceModule.followerOnlyReferenceModule
    ? ReferenceModuleType.FollowerOnlyReferenceModule
    : null

  const canUseRelay = activeChannel?.lensManager && activeChannel?.sponsor

  const redirectToChannelPage = () => {
    router.push(
      uploadedVideo.isByteVideo
        ? `/channel/${trimLensHandle(activeChannel?.handle)}?tab=bytes`
        : `/channel/${trimLensHandle(activeChannel?.handle)}`
    )
  }

  const redirectToWatchPage = (videoId: string) => {
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

  const resetToDefaults = () => {
    setUploadedVideo(UPLOADED_VIDEO_FORM_DEFAULTS)
  }

  useEffect(() => {
    Analytics.track('Pageview', { path: TRACK.PAGE_VIEW.UPLOAD.STEPS })
  }, [])

  const stopLoading = () => {
    setUploadedVideo({
      buttonText: t`Post Video`,
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
    Analytics.track(TRACK.PUBLICATION.NEW_POST, {
      video_format: uploadedVideo.videoType,
      video_type: uploadedVideo.isByteVideo ? 'SHORT_FORM' : 'LONG_FORM',
      publication_state: uploadedVideo.collectModule.isRevertCollect
        ? 'DATA_ONLY'
        : 'ON_CHAIN',
      video_storage: uploadedVideo.isUploadToIpfs ? 'IPFS' : 'ARWEAVE',
      publication_collect_module: Object.keys(
        getCollectModule(uploadedVideo.collectModule)
      )[0],
      publication_reference_module: enabledReferenceModule,
      publication_reference_module_degrees_of_separation: uploadedVideo
        .referenceModule.degreesOfSeparationReferenceModule
        ? degreesOfSeparation
        : null,
      user_id: activeChannel?.id
    })
    return stopLoading()
  }

  const initBundlr = async () => {
    if (signer && address && !bundlrData.instance) {
      toast.loading(BUNDLR_CONNECT_MESSAGE)
      const bundlr = await getBundlrInstance(signer)
      if (bundlr) {
        setBundlrData({ instance: bundlr })
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
      if (data.hash) {
        setToQueue({ txnHash: data.hash })
      }
    },
    onError
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
        buttonText: t`Storing metadata`,
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
          value: `${activeChannel?.handle}`
        },
        {
          type: MetadataAttributeType.STRING,
          key: 'app',
          value: LENSTUBE_WEBSITE_URL
        }
      ]

      const publicationMetadata: VideoOptions = {
        video: {
          item: uploadedVideo.videoSource,
          type: MediaVideoMimeType.MP4,
          altTag: uploadedVideo.title,
          attributes,
          cover: uploadedVideo.thumbnail,
          duration: uploadedVideo.durationInSeconds,
          license: MetadataLicenseType.CCO
        },
        appId: LENSTUBE_APP_ID,
        id: uuidv4(),
        attributes,
        content: trimify(
          `${uploadedVideo.title}\n\n${uploadedVideo.description}`
        ),
        tags: [uploadedVideo.videoCategory.tag],
        locale: getUserLocale(),
        title: uploadedVideo.title,
        marketplace: {
          attributes,
          animation_url: uploadedVideo.videoSource,
          external_url: `${LENSTUBE_WEBSITE_URL}/channel/${activeChannel?.handle}`,
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
        buttonText: t`Posting video`,
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
      } else {
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
              ...getCollectModule(uploadedVideo.collectModule)
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
            variables: { request }
          })
        }
      }
    } catch (error) {}
  }

  const uploadVideoToIpfs = async () => {
    const result = await uploadToIPFS(
      uploadedVideo.file as File,
      (percentCompleted) => {
        setUploadedVideo({
          buttonText: t`Uploading to IPFS`,
          loading: true,
          percent: percentCompleted
        })
      }
    )
    if (!result.url) {
      stopLoading()
      return toast.error(t`IPFS Upload failed`)
    }
    setUploadedVideo({
      percent: 100,
      videoSource: result.url
    })
    return await createPublication({
      videoSource: result.url
    })
  }

  const uploadToBundlr = async () => {
    if (!bundlrData.instance) {
      stopLoading()
      return await initBundlr()
    }
    if (!uploadedVideo.stream) {
      stopLoading()
      return toast.error(t`Video not uploaded correctly`)
    }
    if (
      parseFloat(bundlrData.balance) < parseFloat(bundlrData.estimatedPrice)
    ) {
      stopLoading()
      return toast.error(t`Insufficient storage balance`)
    }
    try {
      setUploadedVideo({
        loading: true,
        buttonText: t`Uploading to Arweave`
      })
      const bundlr = bundlrData.instance
      const tags = [
        { name: 'Content-Type', value: uploadedVideo.videoType || 'video/mp4' },
        { name: 'App-Name', value: LENSTUBE_APP_NAME },
        { name: 'Profile-Id', value: activeChannel?.id },
        // ANS-110 standard
        { name: 'Title', value: trimify(uploadedVideo.title) },
        { name: 'Type', value: 'video' },
        { name: 'Topic', value: uploadedVideo.videoCategory.name },
        {
          name: 'Description',
          value: trimify(uploadedVideo.description)
        }
      ]
      const fileSize = uploadedVideo?.file?.size as number
      const uploader = bundlr.uploader.chunkedUploader
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
      toast.error(t`Failed to upload video to Arweave`)
      logger.error('[Error Bundlr Upload Video]', error)
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
      await uploadToBundlr()
    }
  }

  return (
    <div className="mx-auto my-10 gap-5">
      <MetaTags title="Video Details" />
      <div className="mt-10">
        <Details onCancel={resetToDefaults} onUpload={onUpload} />
      </div>
    </div>
  )
}

export default UploadSteps
