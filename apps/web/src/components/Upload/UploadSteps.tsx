import { LENSHUB_PROXY_ABI } from '@abis/LensHubProxy'
import MetaTags from '@components/Common/MetaTags'
import useAppStore, { UPLOADED_VIDEO_FORM_DEFAULTS } from '@lib/store'
import useChannelStore from '@lib/store/channel'
import usePersistStore from '@lib/store/persist'
import { utils } from 'ethers'
import type {
  CreatePostBroadcastItemResult,
  CreatePublicPostRequest,
  MetadataAttributeInput,
  PublicationMetadataMediaInput,
  PublicationMetadataV2Input
} from 'lens'
import {
  PublicationContentWarning,
  PublicationMainFocus,
  PublicationMetadataDisplayTypes,
  ReferenceModules,
  useBroadcastMutation,
  useCreatePostTypedDataMutation,
  useCreatePostViaDispatcherMutation
} from 'lens'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import toast from 'react-hot-toast'
import type { CustomErrorWithData } from 'utils'
import {
  Analytics,
  BUNDLR_CONNECT_MESSAGE,
  ERROR_MESSAGE,
  LENSHUB_PROXY_ADDRESS,
  LENSTUBE_APP_ID,
  LENSTUBE_APP_NAME,
  LENSTUBE_BYTES_APP_ID,
  LENSTUBE_WEBSITE_URL,
  TRACK
} from 'utils'
import canUploadedToIpfs from 'utils/functions/canUploadedToIpfs'
import { checkIsBytesVideo } from 'utils/functions/checkIsBytesVideo'
import { getCollectModule } from 'utils/functions/getCollectModule'
import getUserLocale from 'utils/functions/getUserLocale'
import omitKey from 'utils/functions/omitKey'
import trimify from 'utils/functions/trimify'
import uploadToAr from 'utils/functions/uploadToAr'
import uploadToIPFS from 'utils/functions/uploadToIPFS'
import logger from 'utils/logger'
import { v4 as uuidv4 } from 'uuid'
import {
  useAccount,
  useContractWrite,
  useSigner,
  useSignTypedData
} from 'wagmi'

import type { VideoFormData } from './Details'
import Details from './Details'

const UploadSteps = () => {
  const getBundlrInstance = useAppStore((state) => state.getBundlrInstance)
  const setBundlrData = useAppStore((state) => state.setBundlrData)
  const bundlrData = useAppStore((state) => state.bundlrData)
  const uploadedVideo = useAppStore((state) => state.uploadedVideo)
  const setUploadedVideo = useAppStore((state) => state.setUploadedVideo)
  const selectedChannel = useChannelStore((state) => state.selectedChannel)

  const queuedVideos = usePersistStore((state) => state.queuedVideos)
  const setQueuedVideos = usePersistStore((state) => state.setQueuedVideos)
  const { address } = useAccount()
  const { data: signer } = useSigner()
  const router = useRouter()

  const degreesOfSeparation = uploadedVideo.referenceModule
    ?.degreesOfSeparationReferenceModule?.degreesOfSeparation as number
  const enabledReferenceModule = uploadedVideo.referenceModule
    ?.degreesOfSeparationReferenceModule
    ? ReferenceModules.DegreesOfSeparationReferenceModule
    : uploadedVideo.referenceModule.followerOnlyReferenceModule
    ? ReferenceModules.FollowerOnlyReferenceModule
    : null

  const setToQueue = (txn: { txnId?: string; txnHash?: string }) => {
    setQueuedVideos([
      {
        thumbnailUrl: uploadedVideo.thumbnail,
        title: uploadedVideo.title,
        txnId: txn.txnId,
        txnHash: txn.txnHash
      },
      ...(queuedVideos || [])
    ])
    router.push(
      uploadedVideo.isByteVideo
        ? `/channel/${selectedChannel?.handle}?tab=bytes`
        : `/channel/${selectedChannel?.handle}`
    )
  }

  const resetToDefaults = () => {
    setUploadedVideo(UPLOADED_VIDEO_FORM_DEFAULTS)
  }

  useEffect(() => {
    Analytics.track('Pageview', { path: TRACK.PAGE_VIEW.UPLOAD.STEPS })
  }, [])

  const onError = (error: CustomErrorWithData) => {
    toast.error(error?.data?.message ?? error?.message ?? ERROR_MESSAGE)
    setUploadedVideo({
      buttonText: 'Post Video',
      loading: false
    })
  }

  const onCompleted = (data: any) => {
    if (
      data?.broadcast?.reason === 'NOT_ALLOWED' ||
      data.createPostViaDispatcher?.reason
    ) {
      return
    }
    const txnId = data?.createPostViaDispatcher?.txId ?? data?.broadcast?.txId
    setToQueue({ txnId })
    Analytics.track(TRACK.PUBLICATION.NEW_POST, {
      video_format: uploadedVideo.videoType,
      video_type: uploadedVideo.isByteVideo ? 'SHORT_FORM' : 'LONG_FORM',
      video_storage: uploadedVideo.isUploadToIpfs ? 'IPFS' : 'ARWEAVE',
      publication_collect_module: Object.keys(
        getCollectModule(uploadedVideo.collectModule)
      )[0],
      publication_reference_module: enabledReferenceModule,
      publication_reference_module_degrees_of_separation: uploadedVideo
        .referenceModule.degreesOfSeparationReferenceModule
        ? degreesOfSeparation
        : null
    })
    return setUploadedVideo({
      buttonText: 'Post Video',
      loading: false
    })
  }

  const { signTypedDataAsync } = useSignTypedData({
    onError
  })
  const [broadcast] = useBroadcastMutation({
    onCompleted,
    onError
  })

  const { write: writePostContract } = useContractWrite({
    address: LENSHUB_PROXY_ADDRESS,
    abi: LENSHUB_PROXY_ABI,
    functionName: 'postWithSig',
    mode: 'recklesslyUnprepared',
    onSuccess: (data) => {
      setUploadedVideo({
        buttonText: 'Post Video',
        loading: false
      })
      if (data.hash) {
        setToQueue({ txnHash: data.hash })
      }
    },
    onError
  })

  const [createPostViaDispatcher] = useCreatePostViaDispatcherMutation({
    onError,
    onCompleted
  })

  const initBundlr = async () => {
    if (signer?.provider && address && !bundlrData.instance) {
      toast.loading(BUNDLR_CONNECT_MESSAGE)
      const bundlr = await getBundlrInstance(signer)
      if (bundlr) {
        setBundlrData({ instance: bundlr })
      }
    }
  }

  const [createPostTypedData] = useCreatePostTypedDataMutation({
    onCompleted: async ({ createPostTypedData }) => {
      const { typedData, id } =
        createPostTypedData as CreatePostBroadcastItemResult
      const {
        profileId,
        contentURI,
        collectModule,
        collectModuleInitData,
        referenceModule,
        referenceModuleInitData
      } = typedData?.value
      try {
        toast.loading('Requesting signature...')
        const signature = await signTypedDataAsync({
          domain: omitKey(typedData?.domain, '__typename'),
          types: omitKey(typedData?.types, '__typename'),
          value: omitKey(typedData?.value, '__typename')
        })
        const { v, r, s } = utils.splitSignature(signature)
        const args = {
          profileId,
          contentURI,
          collectModule,
          collectModuleInitData,
          referenceModule,
          referenceModuleInitData,
          sig: { v, r, s, deadline: typedData.value.deadline }
        }
        const { data } = await broadcast({
          variables: { request: { id, signature } }
        })
        if (data?.broadcast?.__typename === 'RelayError') {
          return writePostContract?.({ recklesslySetUnpreparedArgs: [args] })
        }
      } catch {}
    },
    onError
  })

  const createTypedData = async (request: CreatePublicPostRequest) => {
    await createPostTypedData({
      variables: { request }
    })
  }

  const createViaDispatcher = async (request: CreatePublicPostRequest) => {
    const { data } = await createPostViaDispatcher({
      variables: { request }
    })
    if (data?.createPostViaDispatcher.__typename === 'RelayError') {
      await createTypedData(request)
    }
  }

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
      const media: Array<PublicationMetadataMediaInput> = [
        {
          item: uploadedVideo.videoSource,
          type: uploadedVideo.videoType,
          cover: uploadedVideo.thumbnail
        }
      ]
      const attributes: MetadataAttributeInput[] = [
        {
          displayType: PublicationMetadataDisplayTypes.String,
          traitType: 'handle',
          value: `${selectedChannel?.handle}`
        },
        {
          displayType: PublicationMetadataDisplayTypes.String,
          traitType: 'app',
          value: LENSTUBE_APP_ID
        }
      ]
      if (uploadedVideo.durationInSeconds) {
        attributes.push({
          displayType: PublicationMetadataDisplayTypes.String,
          traitType: 'durationInSeconds',
          value: uploadedVideo.durationInSeconds.toString()
        })
      }
      const isByteVideo = checkIsBytesVideo(uploadedVideo.description)
      const metadata: PublicationMetadataV2Input = {
        version: '2.0.0',
        metadata_id: uuidv4(),
        description: trimify(uploadedVideo.description),
        content: trimify(
          `${uploadedVideo.title}\n\n${uploadedVideo.description}`
        ),
        locale: getUserLocale(),
        tags: [uploadedVideo.videoCategory.tag],
        mainContentFocus: PublicationMainFocus.Video,
        external_url: `${LENSTUBE_WEBSITE_URL}/channel/${selectedChannel?.handle}`,
        animation_url: uploadedVideo.videoSource,
        image: uploadedVideo.thumbnail,
        imageMimeType: uploadedVideo.thumbnailType,
        name: trimify(uploadedVideo.title),
        attributes,
        media,
        appId: isByteVideo ? LENSTUBE_BYTES_APP_ID : LENSTUBE_APP_ID
      }
      if (uploadedVideo.isSensitiveContent) {
        metadata.contentWarning = PublicationContentWarning.Sensitive
      }
      const { url } = await uploadToAr(metadata)
      setUploadedVideo({
        buttonText: 'Posting video',
        loading: true,
        isByteVideo
      })

      const isRestricted = Boolean(degreesOfSeparation)
      const referenceModuleDegrees = {
        commentsRestricted: isRestricted,
        mirrorsRestricted: isRestricted,
        degreesOfSeparation: degreesOfSeparation
      }

      const request = {
        profileId: selectedChannel?.id,
        contentURI: url,
        collectModule: getCollectModule(uploadedVideo.collectModule),
        referenceModule: {
          followerOnlyReferenceModule:
            uploadedVideo.referenceModule?.followerOnlyReferenceModule,
          degreesOfSeparationReferenceModule: uploadedVideo.referenceModule
            ?.degreesOfSeparationReferenceModule
            ? referenceModuleDegrees
            : null
        }
      }
      const canUseDispatcher = selectedChannel?.dispatcher?.canUseRelay
      if (!canUseDispatcher) {
        return createTypedData(request)
      }
      await createViaDispatcher(request)
    } catch {}
  }

  const uploadVideoToIpfs = async () => {
    const result = await uploadToIPFS(
      uploadedVideo.file as File,
      (percentCompleted) => {
        setUploadedVideo({
          buttonText: 'Uploading to IPFS',
          loading: true,
          percent: percentCompleted
        })
      }
    )
    if (!result.url) {
      return toast.error('IPFS Upload failed!')
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
      return await initBundlr()
    }
    if (!uploadedVideo.stream) {
      return toast.error('Video not uploaded correctly.')
    }
    if (
      parseFloat(bundlrData.balance) < parseFloat(bundlrData.estimatedPrice)
    ) {
      return toast.error('Insufficient balance')
    }
    try {
      setUploadedVideo({
        loading: true,
        buttonText: 'Uploading to Arweave'
      })
      const bundlr = bundlrData.instance
      const tags = [
        { name: 'Content-Type', value: uploadedVideo.videoType || 'video/mp4' },
        { name: 'App-Name', value: LENSTUBE_APP_NAME },
        { name: 'Profile-Id', value: selectedChannel?.id }
      ]
      const uploader = bundlr.uploader.chunkedUploader
      uploader.setChunkSize(10000000) // 10 MB
      uploader.on('chunkUpload', (chunkInfo) => {
        const fileSize = uploadedVideo?.file?.size as number
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
      toast.error('Failed to upload video!')
      logger.error('[Error Bundlr Upload Video]', error)
      return setUploadedVideo({
        loading: false,
        buttonText: 'Post Video'
      })
    }
  }

  const onUpload = async (data: VideoFormData) => {
    uploadedVideo.title = data.title
    uploadedVideo.description = data.description
    uploadedVideo.isSensitiveContent = data.isSensitiveContent
    uploadedVideo.loading = true
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
    <div className="mx-auto my-10 max-w-5xl gap-5">
      <MetaTags title="Video Details" />
      <div className="mt-10">
        <Details onCancel={resetToDefaults} onUpload={onUpload} />
      </div>
    </div>
  )
}

export default UploadSteps
