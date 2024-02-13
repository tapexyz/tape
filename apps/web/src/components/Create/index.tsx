import MetaTags from '@components/Common/MetaTags'
import type {
  AudioOptions,
  MediaAudioMimeType,
  MediaVideoMimeType,
  MetadataAttribute,
  VideoOptions
} from '@lens-protocol/metadata'
import {
  audio,
  MetadataAttributeType,
  PublicationContentWarning,
  shortVideo,
  video
} from '@lens-protocol/metadata'
import { getCollectModuleInput } from '@lib/getCollectModuleInput'
import useAppStore, { UPLOADED_VIDEO_FORM_DEFAULTS } from '@lib/store'
import useProfileStore from '@lib/store/idb/profile'
import useNonceStore from '@lib/store/nonce'
import usePersistStore from '@lib/store/persist'
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
  checkLensManagerPermissions,
  EVENTS,
  getProfile,
  getSignature,
  getUploadedMediaType,
  logger,
  Tower,
  trimify,
  uploadToAr
} from '@tape.xyz/generic'
import type {
  CreateMomokaPostEip712TypedData,
  CreateOnchainPostEip712TypedData,
  OnchainPostRequest,
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
import {
  useAccount,
  useSignTypedData,
  useWalletClient,
  useWriteContract
} from 'wagmi'

import type { VideoFormData } from './Details'
import Details from './Details'

const CreateSteps = () => {
  const getIrysInstance = useAppStore((state) => state.getIrysInstance)
  const setIrysData = useAppStore((state) => state.setIrysData)
  const irysData = useAppStore((state) => state.irysData)
  const uploadedMedia = useAppStore((state) => state.uploadedMedia)
  const setUploadedMedia = useAppStore((state) => state.setUploadedMedia)
  const activeProfile = useProfileStore(
    (state) => state.activeProfile
  ) as Profile

  const { lensHubOnchainSigNonce, setLensHubOnchainSigNonce } = useNonceStore()
  const { queuedVideos, setQueuedVideos } = usePersistStore()

  const { address } = useAccount()
  const router = useRouter()
  const { data: walletClient } = useWalletClient()

  const { canUseLensManager, canBroadcast } =
    checkLensManagerPermissions(activeProfile)

  const degreesOfSeparation = uploadedMedia.referenceModule
    ?.degreesOfSeparationReferenceModule?.degreesOfSeparation as number
  const enabledReferenceModule = uploadedMedia.referenceModule
    ?.degreesOfSeparationReferenceModule
    ? ReferenceModuleType.DegreesOfSeparationReferenceModule
    : uploadedMedia.referenceModule.followerOnlyReferenceModule
      ? ReferenceModuleType.FollowerOnlyReferenceModule
      : null

  const resetToDefaults = () => {
    setUploadedMedia(UPLOADED_VIDEO_FORM_DEFAULTS)
  }

  const redirectToChannelPage = () => {
    resetToDefaults()
    router.push(
      uploadedMedia.isByteVideo
        ? `/u/${getProfile(activeProfile)?.slug}?tab=bytes`
        : `/u/${getProfile(activeProfile)?.slug}`
    )
  }

  const redirectToWatchPage = (pubId: string) => {
    resetToDefaults()
    if (uploadedMedia.type === 'AUDIO') {
      return router.push(`/listen/${pubId}`)
    }
    router.push(`/watch/${pubId}`)
  }

  const setToQueue = (txn: { txnId?: string; txnHash?: string }) => {
    if (txn.txnHash || txn.txnId) {
      setQueuedVideos([
        {
          thumbnailUrl: uploadedMedia.thumbnail,
          title: uploadedMedia.title,
          txnId: txn.txnId,
          txnHash: txn.txnHash
        },
        ...(queuedVideos || [])
      ])
    }
    redirectToChannelPage()
  }

  useEffect(() => {
    Tower.track(EVENTS.PAGEVIEW, { page: EVENTS.PAGE_VIEW.UPLOAD })
  }, [])

  const stopLoading = () => {
    setUploadedMedia({
      buttonText: 'Post Now',
      loading: false
    })
  }

  const onError = (error: CustomErrorWithData) => {
    stopLoading()
    toast.error(error?.data?.message ?? error?.message ?? ERROR_MESSAGE)
    logger.error('[Create Publication]', error)
  }

  const onCompleted = (__typename?: 'RelayError' | 'RelaySuccess') => {
    if (__typename === 'RelayError') {
      return
    }
    Tower.track(EVENTS.PUBLICATION.NEW_POST, {
      video_format: uploadedMedia.mediaType,
      video_type: uploadedMedia.isByteVideo ? 'SHORT_FORM' : 'LONG_FORM',
      publication_state: uploadedMedia.collectModule.isRevertCollect
        ? 'MOMOKA'
        : 'ON_CHAIN',
      video_storage: uploadedMedia.isUploadToIpfs ? 'IPFS' : 'ARWEAVE',
      publication_collect_module: Object.keys(
        getCollectModuleInput(uploadedMedia.collectModule)
      )[0],
      publication_reference_module: enabledReferenceModule,
      publication_reference_module_degrees_of_separation: uploadedMedia
        .referenceModule.degreesOfSeparationReferenceModule
        ? degreesOfSeparation
        : null,
      user_id: activeProfile?.id
    })
    return stopLoading()
  }

  const initIrys = async () => {
    if (walletClient && address && !irysData.instance) {
      toast.loading(IRYS_CONNECT_MESSAGE)
      const instance = await getIrysInstance(walletClient)
      if (instance) {
        setIrysData({ instance })
      }
    }
  }

  const { signTypedDataAsync } = useSignTypedData({
    mutation: { onError }
  })

  const { writeContractAsync } = useWriteContract({
    mutation: {
      onSuccess: (txnHash) => {
        if (txnHash) {
          setToQueue({ txnHash })
        }
        stopLoading()
        setLensHubOnchainSigNonce(lensHubOnchainSigNonce + 1)
      },
      onError: (error) => {
        onError(error)
        setLensHubOnchainSigNonce(lensHubOnchainSigNonce - 1)
      }
    }
  })

  const write = async ({ args }: { args: any[] }) => {
    return await writeContractAsync({
      address: LENSHUB_PROXY_ADDRESS,
      abi: LENSHUB_PROXY_ABI,
      functionName: 'post',
      args
    })
  }

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
        if (canBroadcast) {
          const signature = await getSignatureFromTypedData(typedData)
          const { data } = await broadcastOnchain({
            variables: { request: { id, signature } }
          })
          if (data?.broadcastOnchain?.__typename === 'RelayError') {
            return await write({ args: [typedData.value] })
          }
          return
        }
        return await write({ args: [typedData.value] })
      } catch {
        setUploadedMedia({
          buttonText: 'Post Now',
          loading: false
        })
      }
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
        if (canBroadcast) {
          const signature = await getSignatureFromTypedData(typedData)
          const { data } = await broadcastOnMomoka({
            variables: { request: { id, signature } }
          })
          if (data?.broadcastOnMomoka?.__typename === 'RelayError') {
            return write({ args: [typedData.value] })
          }
          return
        }
        return write({ args: [typedData.value] })
      } catch {
        setUploadedMedia({
          buttonText: 'Post Now',
          loading: false
        })
      }
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

  const createPost = async (metadataUri: string) => {
    setUploadedMedia({
      buttonText: 'Posting...',
      loading: true
    })

    const isRestricted = Boolean(degreesOfSeparation)

    const { isRevertCollect } = uploadedMedia.collectModule

    if (isRevertCollect) {
      // MOMOKA
      if (canUseLensManager) {
        return await postOnMomoka({
          variables: {
            request: {
              contentURI: metadataUri
            }
          }
        })
      }

      return await createMomokaPostTypedData({
        variables: {
          request: {
            contentURI: metadataUri
          }
        }
      })
    }

    // ON-CHAIN
    const referenceModuleDegrees = {
      commentsRestricted: isRestricted,
      mirrorsRestricted: isRestricted,
      degreesOfSeparation: degreesOfSeparation ?? 0,
      quotesRestricted: isRestricted
    }
    const referenceModule: ReferenceModuleInput = {
      ...(uploadedMedia.referenceModule?.followerOnlyReferenceModule
        ? { followerOnlyReferenceModule: true }
        : { degreesOfSeparationReferenceModule: referenceModuleDegrees })
    }

    const request: OnchainPostRequest = {
      contentURI: metadataUri,
      openActionModules: [
        {
          ...getCollectModuleInput(uploadedMedia.collectModule),
          ...(uploadedMedia?.unknownOpenAction && {
            unknownOpenAction: {
              address: uploadedMedia.unknownOpenAction.address,
              data: uploadedMedia.unknownOpenAction.data
            }
          })
        }
      ],
      referenceModule
    }
    if (canUseLensManager) {
      return await postOnchain({
        variables: { request }
      })
    }
    return await createOnchainPostTypedData({
      variables: {
        options: { overrideSigNonce: lensHubOnchainSigNonce },
        request
      }
    })
  }

  const constructVideoMetadata = async () => {
    const attributes: MetadataAttribute[] = [
      {
        type: MetadataAttributeType.STRING,
        key: 'category',
        value: uploadedMedia.mediaCategory.tag
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

    const profileSlug = getProfile(activeProfile)?.slug
    const publicationMetadata: VideoOptions = {
      video: {
        item: uploadedMedia.dUrl,
        type: getUploadedMediaType(
          uploadedMedia.mediaType
        ) as MediaVideoMimeType,
        altTag: trimify(uploadedMedia.title),
        attributes,
        cover: uploadedMedia.thumbnail,
        duration: uploadedMedia.durationInSeconds,
        license: uploadedMedia.mediaLicense
      },
      appId: TAPE_APP_ID,
      id: uuidv4(),
      attributes,
      content: trimify(uploadedMedia.description),
      tags: [uploadedMedia.mediaCategory.tag],
      locale: getUserLocale(),
      title: uploadedMedia.title,
      marketplace: {
        attributes,
        animation_url: uploadedMedia.dUrl,
        external_url: `${TAPE_WEBSITE_URL}/u/${profileSlug}`,
        image: uploadedMedia.thumbnail,
        name: uploadedMedia.title,
        description: trimify(uploadedMedia.description)
      }
    }

    if (uploadedMedia.isSensitiveContent) {
      publicationMetadata.contentWarning = PublicationContentWarning.SENSITIVE
    }

    const shortVideoMetadata = shortVideo(publicationMetadata)
    const longVideoMetadata = video(publicationMetadata)
    const metadataUri = await uploadToAr(
      uploadedMedia.isByteVideo ? shortVideoMetadata : longVideoMetadata
    )
    await createPost(metadataUri)
  }

  const profileSlug = getProfile(activeProfile)?.slug

  const constructAudioMetadata = async () => {
    const attributes: MetadataAttribute[] = [
      {
        type: MetadataAttributeType.STRING,
        key: 'category',
        value: uploadedMedia.mediaCategory.tag
      },
      {
        type: MetadataAttributeType.STRING,
        key: 'creator',
        value: profileSlug
      },
      {
        type: MetadataAttributeType.STRING,
        key: 'app',
        value: TAPE_WEBSITE_URL
      }
    ]

    const audioMetadata: AudioOptions = {
      audio: {
        item: uploadedMedia.dUrl,
        type: getUploadedMediaType(
          uploadedMedia.mediaType
        ) as MediaAudioMimeType,
        artist: profileSlug,
        attributes,
        cover: uploadedMedia.thumbnail,
        duration: uploadedMedia.durationInSeconds,
        license: uploadedMedia.mediaLicense
      },
      appId: TAPE_APP_ID,
      id: uuidv4(),
      attributes,
      content: trimify(uploadedMedia.description),
      tags: [uploadedMedia.mediaCategory.tag],
      locale: getUserLocale(),
      title: uploadedMedia.title,
      marketplace: {
        attributes,
        animation_url: uploadedMedia.dUrl,
        external_url: `${TAPE_WEBSITE_URL}/u/${profileSlug}`,
        image: uploadedMedia.thumbnail,
        name: uploadedMedia.title,
        description: trimify(uploadedMedia.description)
      }
    }

    if (uploadedMedia.isSensitiveContent) {
      audioMetadata.contentWarning = PublicationContentWarning.SENSITIVE
    }

    const metadataUri = await uploadToAr(audio(audioMetadata))
    await createPost(metadataUri)
  }

  const create = async ({ dUrl }: { dUrl: string }) => {
    try {
      setUploadedMedia({
        buttonText: 'Storing metadata...',
        loading: true
      })
      uploadedMedia.dUrl = dUrl
      if (uploadedMedia.type === 'AUDIO') {
        return await constructAudioMetadata()
      }
      await constructVideoMetadata()
    } catch (error: any) {
      onError(error)
    }
  }

  const uploadVideoToIpfs = async () => {
    const result = await uploadToIPFS(
      uploadedMedia.file as File,
      (percentCompleted) => {
        setUploadedMedia({
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
    setUploadedMedia({
      percent: 100,
      dUrl: result.url
    })
    return await create({
      dUrl: result.url
    })
  }

  const uploadToIrys = async () => {
    if (!irysData.instance) {
      stopLoading()
      return await initIrys()
    }
    if (!uploadedMedia.stream) {
      stopLoading()
      return toast.error('Media not uploaded correctly')
    }
    if (parseFloat(irysData.balance) < parseFloat(irysData.estimatedPrice)) {
      stopLoading()
      return toast.error('Insufficient storage balance')
    }
    try {
      setUploadedMedia({
        loading: true,
        buttonText: 'Uploading...'
      })
      const instance = irysData.instance
      const tags = [
        { name: 'Content-Type', value: uploadedMedia.mediaType },
        { name: 'App-Name', value: TAPE_APP_NAME },
        { name: 'Profile-Id', value: activeProfile?.id },
        // ANS-110 standard
        { name: 'Title', value: trimify(uploadedMedia.title) },
        { name: 'Type', value: uploadedMedia.type.toLowerCase() },
        { name: 'Topic', value: uploadedMedia.mediaCategory.name },
        {
          name: 'Description',
          value: trimify(uploadedMedia.description)
        }
      ]
      const fileSize = uploadedMedia?.file?.size as number
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
        setUploadedMedia({
          loading: true,
          percent: percentCompleted
        })
      })
      const upload = uploader.uploadData(uploadedMedia.stream as any, {
        tags
      })
      const response = await upload
      setUploadedMedia({
        loading: false,
        dUrl: `ar://${response.data.id}`
      })
      return await create({
        dUrl: `ar://${response.data.id}`
      })
    } catch (error) {
      toast.error('Failed to upload media to Arweave')
      logger.error('[Error Irys Upload Media]', error)
      return stopLoading()
    }
  }

  const onUpload = async (data: VideoFormData & { thumbnail: string }) => {
    uploadedMedia.title = data.title
    uploadedMedia.loading = true
    uploadedMedia.description = data.description
    uploadedMedia.isSensitiveContent = data.isSensitiveContent
    uploadedMedia.thumbnail = data.thumbnail
    setUploadedMedia({ ...uploadedMedia })
    // Upload video directly from source without uploading again
    if (
      uploadedMedia.dUrl?.length &&
      (uploadedMedia.dUrl.includes('ar://') ||
        uploadedMedia.dUrl.includes('ipfs://'))
    ) {
      return await create({
        dUrl: uploadedMedia.dUrl
      })
    }
    if (
      canUploadedToIpfs(uploadedMedia.file?.size || 0, activeProfile.sponsor) &&
      uploadedMedia.isUploadToIpfs
    ) {
      return await uploadVideoToIpfs()
    } else {
      await uploadToIrys()
    }
  }

  return (
    <div className="container mx-auto max-w-screen-xl">
      <MetaTags title="Create" />
      <Details onCancel={resetToDefaults} onUpload={onUpload} />
    </div>
  )
}

export default CreateSteps
