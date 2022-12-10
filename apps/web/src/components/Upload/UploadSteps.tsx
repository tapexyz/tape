import { LENSHUB_PROXY_ABI } from '@abis/LensHubProxy'
import MetaTags from '@components/Common/MetaTags'
import useAppStore from '@lib/store'
import usePersistStore, {
  UPLOADED_VIDEO_FORM_DEFAULTS
} from '@lib/store/persist'
import axios from 'axios'
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
  useBroadcastMutation,
  useCreatePostTypedDataMutation,
  useCreatePostViaDispatcherMutation
} from 'lens'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import toast from 'react-hot-toast'
import type { CustomErrorWithData } from 'utils'
import {
  ALLOWED_PLAYBACK_VIDEO_TYPES,
  Analytics,
  ARWEAVE_WEBSITE_URL,
  BUNDLR_CONNECT_MESSAGE,
  ERROR_MESSAGE,
  IS_MAINNET,
  LENSHUB_PROXY_ADDRESS,
  LENSTUBE_API_URL,
  LENSTUBE_APP_ID,
  LENSTUBE_APP_NAME,
  LENSTUBE_BYTES_APP_ID,
  LENSTUBE_WEBSITE_URL,
  RELAYER_ENABLED,
  TRACK,
  VIDEO_CDN_URL
} from 'utils'
import canUploadedToIpfs from 'utils/functions/canUploadedToIpfs'
import { checkIsBytesVideo } from 'utils/functions/checkIsBytesVideo'
import { getCollectModule } from 'utils/functions/getCollectModule'
import getUserLocale from 'utils/functions/getUserLocale'
import omitKey from 'utils/functions/omitKey'
import sanitizeIpfsUrl from 'utils/functions/sanitizeIpfsUrl'
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
  const uploadedVideo = usePersistStore((state) => state.uploadedVideo)
  const setUploadedVideo = usePersistStore((state) => state.setUploadedVideo)
  const selectedChannel = useAppStore((state) => state.selectedChannel)
  const { address } = useAccount()
  const { data: signer } = useSigner()
  const router = useRouter()

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
      data?.broadcast?.reason !== 'NOT_ALLOWED' &&
      !data.createPostViaDispatcher?.reason
    ) {
      Analytics.track(TRACK.UPLOADED_VIDEO, {
        format: uploadedVideo.videoType
      })
      const txnId = data?.createPostViaDispatcher?.txId ?? data?.broadcast?.txId
      setUploadedVideo({
        buttonText: 'Post Video',
        loading: false,
        txnId
      })
      router.push(`/channel/${selectedChannel?.handle}`)
    }
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
    onSuccess: () => {
      setUploadedVideo({
        buttonText: 'Indexing...',
        loading: true
      })
    },
    onError
  })

  const [createPostViaDispatcher] = useCreatePostViaDispatcherMutation({
    onError,
    onCompleted
  })

  const getPlaybackId = async (url: string) => {
    // Only on production and mp4 (supported on livepeer)
    if (
      !IS_MAINNET ||
      !ALLOWED_PLAYBACK_VIDEO_TYPES.includes(uploadedVideo.videoType)
    ) {
      return null
    }
    try {
      const playbackResponse = await axios.post(
        `${LENSTUBE_API_URL}/video/playback`,
        {
          url
        }
      )
      const { playbackId } = playbackResponse.data
      Analytics.track(TRACK.GET_PLAYBACK, {
        format: uploadedVideo.videoType
      })
      return playbackId
    } catch (error) {
      logger.error('[Error Get Playback]', error)
      return null
    }
  }

  const initBundlr = async () => {
    if (signer?.provider && address && !bundlrData.instance) {
      toast(BUNDLR_CONNECT_MESSAGE)
      const bundlr = await getBundlrInstance(signer)
      if (bundlr) {
        setBundlrData({ instance: bundlr })
      }
    }
  }

  const [createPostTypedData] = useCreatePostTypedDataMutation({
    onCompleted: async (data) => {
      const { typedData, id } =
        data.createPostTypedData as CreatePostBroadcastItemResult
      const {
        profileId,
        contentURI,
        collectModule,
        collectModuleInitData,
        referenceModule,
        referenceModuleInitData
      } = typedData?.value
      try {
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
        if (!RELAYER_ENABLED) {
          return writePostContract?.({ recklesslySetUnpreparedArgs: [args] })
        }
        const { data } = await broadcast({
          variables: { request: { id, signature } }
        })
        if (data?.broadcast?.__typename === 'RelayError')
          writePostContract?.({ recklesslySetUnpreparedArgs: [args] })
      } catch {}
    },
    onError
  })

  const signTypedData = (request: CreatePublicPostRequest) => {
    createPostTypedData({
      variables: { request }
    })
  }

  const createViaDispatcher = async (request: CreatePublicPostRequest) => {
    const { data } = await createPostViaDispatcher({
      variables: { request }
    })
    if (data?.createPostViaDispatcher.__typename === 'RelayError') {
      signTypedData(request)
    }
  }

  const createPublication = async ({
    videoSource,
    playbackId
  }: {
    videoSource: string
    playbackId: string
  }) => {
    try {
      setUploadedVideo({
        buttonText: 'Storing metadata...',
        loading: true
      })
      uploadedVideo.playbackId = playbackId
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
      if (uploadedVideo.playbackId) {
        media.push({
          item: `${VIDEO_CDN_URL}/asset/${uploadedVideo.playbackId}/video`,
          type: uploadedVideo.videoType,
          cover: uploadedVideo.thumbnail
        })
      }
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
        external_url: `${LENSTUBE_WEBSITE_URL}/${selectedChannel?.handle}`,
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
        buttonText: 'Posting video...',
        loading: true
      })
      const isRestricted = Boolean(
        uploadedVideo.referenceModule?.degreesOfSeparationReferenceModule
          ?.degreesOfSeparation
      )
      uploadedVideo.isByteVideo = isByteVideo
      const referenceModuleDegrees = {
        commentsRestricted: isRestricted,
        mirrorsRestricted: isRestricted,
        degreesOfSeparation: uploadedVideo.referenceModule
          ?.degreesOfSeparationReferenceModule?.degreesOfSeparation as number
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
      if (isByteVideo) {
        Analytics.track(TRACK.UPLOADED_BYTE_VIDEO, {
          format: uploadedVideo.videoType
        })
      }
      const canUseDispatcher = selectedChannel?.dispatcher?.canUseRelay
      if (!canUseDispatcher) {
        return signTypedData(request)
      }
      await createViaDispatcher(request)
    } catch (error) {
      logger.error('[Error Store & Post Video]', error)
    }
  }

  const uploadVideoToIpfs = async () => {
    const result = await uploadToIPFS(
      uploadedVideo.file as File,
      (percentCompleted) => {
        setUploadedVideo({
          buttonText: 'Uploading to IPFS...',
          loading: true,
          percent: percentCompleted
        })
      }
    )
    if (!result.url) return toast.error('IPFS Upload failed!')
    const playbackId = await getPlaybackId(sanitizeIpfsUrl(result.url))
    setUploadedVideo({
      percent: 100,
      videoSource: result.url,
      playbackId
    })
    Analytics.track(TRACK.UPLOADED_TO_IPFS, {
      format: uploadedVideo.videoType
    })
    return createPublication({
      videoSource: result.url,
      playbackId
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
        buttonText: 'Uploading to Arweave...'
      })
      const bundlr = bundlrData.instance
      const tags = [
        { name: 'Content-Type', value: uploadedVideo.videoType || 'video/mp4' },
        { name: 'App-Name', value: LENSTUBE_APP_NAME }
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
        tags: tags
      })
      const response = await upload
      setUploadedVideo({
        loading: false
      })
      const playbackId = await getPlaybackId(
        `${ARWEAVE_WEBSITE_URL}/${response.data.id}`
      )
      setUploadedVideo({
        videoSource: `${ARWEAVE_WEBSITE_URL}/${response.data.id}`,
        playbackId
      })
      Analytics.track(TRACK.UPLOADED_TO_ARWEAVE, {
        format: uploadedVideo.videoType
      })
      return createPublication({
        videoSource: `${ARWEAVE_WEBSITE_URL}/${response.data.id}`,
        playbackId
      })
    } catch (error) {
      toast.error('Failed to upload video!')
      logger.error('[Error Bundlr Upload Video]', error)
      setUploadedVideo({
        loading: false,
        buttonText: 'Post Video'
      })
    }
  }

  const onUpload = async (data: VideoFormData) => {
    uploadedVideo.title = data.title
    uploadedVideo.description = data.description
    uploadedVideo.isSensitiveContent = data.isSensitiveContent
    if (uploadedVideo.isNSFW || uploadedVideo.isNSFWThumbnail) {
      return toast.error('NSFW content not allowed')
    }
    uploadedVideo.loading = true
    setUploadedVideo({ ...uploadedVideo })
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
    <div className="max-w-5xl gap-5 mx-auto my-10">
      <MetaTags title="Video Details" />
      <div className="mt-10">
        <Details onCancel={resetToDefaults} onUpload={onUpload} />
      </div>
    </div>
  )
}

export default UploadSteps
