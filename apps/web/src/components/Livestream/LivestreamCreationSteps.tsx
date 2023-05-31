import { LENSHUB_PROXY_ABI } from '@abis/LensHubProxy'
import MetaTags from '@components/Common/MetaTags'
import useAppStore, { UPLOADED_LIVESTREAM_FORM_DEFAULTS } from '@lib/store'
import usePersistStore from '@lib/store/persist'
import { useCreateStream } from '@livepeer/react'
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
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import type { CustomErrorWithData } from 'utils'
import {
  Analytics,
  BASE_LIVESTREAM_VIDEO_URL,
  ERROR_MESSAGE,
  LENSHUB_PROXY_ADDRESS,
  LENSTUBE_APP_ID,
  LENSTUBE_WEBSITE_URL,
  TRACK
} from 'utils'
// import { checkIsBytesVideo } from 'utils/functions/checkIsBytesVideo'
import { getCollectModule } from 'utils/functions/getCollectModule'
import getUserLocale from 'utils/functions/getUserLocale'
import omitKey from 'utils/functions/omitKey'
import trimify from 'utils/functions/trimify'
import { usePrevious } from 'utils/hooks/usePrevious'
import logger from 'utils/logger'
import { v4 as uuidv4 } from 'uuid'
import { useContractWrite, useSignTypedData } from 'wagmi'

import type { LivestreamVideoFormData } from './Details'
import Details from './Details'

const LivestreamCreationSteps: React.FC = () => {
  const uploadedLivestream = useAppStore((state) => state.uploadedLivestream)
  const setUploadedLivestream = useAppStore(
    (state) => state.setUploadedLivestream
  )
  // const selectedChannel = useAppStore((state) => state.selectedChannel)
  const queuedLivestreams = usePersistStore((state) => state.queuedLivestreams)
  const setQueuedLivestreams = usePersistStore(
    (state) => state.setQueuedLivestreams
  )
  const [shouldCreateLivestream, setShouldCreateLivestream] = useState(false)
  const {
    mutate: createLivestream,
    data: createLivestreamData,
    status: createLivestreamStatus
  } = useCreateStream({
    name: uploadedLivestream.livestreamName
  })
  const previousLivestreamStatus = usePrevious(createLivestreamStatus)

  const router = useRouter()

  const setToQueue = (txn: { txnId?: string; txnHash?: string }) => {
    setQueuedLivestreams([
      {
        thumbnailUrl: uploadedLivestream.thumbnail,
        title: uploadedLivestream.title,
        txnId: txn.txnId,
        txnHash: txn.txnHash
      },
      ...(queuedLivestreams || [])
    ])
    // router.push(
    //   uploadedLivestream.isByteVideo
    //     ? `/channel/${selectedChannel?.handle}?tab=bytes`
    //     : `/channel/${selectedChannel?.handle}`
    // )
  }

  const resetToDefaults = () => {
    setUploadedLivestream(UPLOADED_LIVESTREAM_FORM_DEFAULTS)
  }

  useEffect(() => {
    resetToDefaults()
    Analytics.track('Pageview', { path: TRACK.PAGE_VIEW.UPLOAD.STEPS })
  }, [])

  const onError = (error: CustomErrorWithData) => {
    toast.error(error?.data?.message ?? error?.message ?? ERROR_MESSAGE)
    setUploadedLivestream({
      buttonText: 'Post Livestream',
      loading: false
    })
  }

  const onCompleted = (data: any) => {
    if (
      data?.broadcast?.reason === 'NOT_ALLOWED' ||
      data.createPostViaDispatcher?.reason
    ) {
      return logger.error('[Error Post Dispatcher]', data)
    }
    const txnId = data?.createPostViaDispatcher?.txId ?? data?.broadcast?.txId
    setToQueue({ txnId })
    toast.success(`Successfully created livestream!`)
    setUploadedLivestream({
      buttonText: 'Post Livestream',
      loading: false
    })
    router.push('/')
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
      setUploadedLivestream({
        buttonText: 'Post Livestream',
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

  const signTypedData = async (request: CreatePublicPostRequest) => {
    await createPostTypedData({
      variables: { request }
    })
  }

  const createViaDispatcher = async (request: CreatePublicPostRequest) => {
    const { data } = await createPostViaDispatcher({
      variables: { request }
    })
    if (data?.createPostViaDispatcher.__typename === 'RelayError') {
      await signTypedData(request)
    }
  }

  const createPublication = async () => {
    try {
      setUploadedLivestream({
        buttonText: 'Storing metadata...',
        loading: true
      })

      uploadedLivestream.livestreamKey = createLivestreamData?.streamKey || ''
      uploadedLivestream.livestreamPlaybackId =
        createLivestreamData?.playbackId || ''
      uploadedLivestream.videoSource = BASE_LIVESTREAM_VIDEO_URL
      uploadedLivestream.videoType = 'video/mp4'

      const media: Array<PublicationMetadataMediaInput> = [
        {
          item: uploadedLivestream.videoSource,
          type: uploadedLivestream.videoType,
          cover: uploadedLivestream.thumbnail
        }
      ]
      const attributes: MetadataAttributeInput[] = [
        // {
        //   displayType: PublicationMetadataDisplayTypes.String,
        //   traitType: 'handle',
        //   value: `${selectedChannel?.handle}`
        // },
        {
          displayType: PublicationMetadataDisplayTypes.String,
          traitType: 'app',
          value: LENSTUBE_APP_ID
        },
        {
          displayType: PublicationMetadataDisplayTypes.String,
          traitType: 'isLivestream',
          value: `${uploadedLivestream?.isLivestream}`
        },
        {
          displayType: PublicationMetadataDisplayTypes.String,
          traitType: 'livestreamPlaybackId',
          value: `${uploadedLivestream?.livestreamPlaybackId}`
        },
        {
          displayType: PublicationMetadataDisplayTypes.String,
          traitType: 'livestreamKey',
          value: `${uploadedLivestream?.livestreamKey}`
        },
        {
          displayType: PublicationMetadataDisplayTypes.String,
          traitType: 'livestreamType',
          value: `${uploadedLivestream?.livestreamType}`
        }
      ]
      if (uploadedLivestream.durationInSeconds) {
        attributes.push({
          displayType: PublicationMetadataDisplayTypes.String,
          traitType: 'durationInSeconds',
          value: uploadedLivestream.durationInSeconds.toString()
        })
      }
      // const isByteVideo = checkIsBytesVideo(uploadedLivestream.description)
      const metadata: PublicationMetadataV2Input = {
        version: '2.0.0',
        metadata_id: uuidv4(),
        description: trimify(uploadedLivestream.description),
        content: trimify(
          `${uploadedLivestream.title}\n\n${uploadedLivestream.description}`
        ),
        locale: getUserLocale(),
        tags: [uploadedLivestream.videoCategory.tag],
        mainContentFocus: PublicationMainFocus.Video,
        external_url: `${LENSTUBE_WEBSITE_URL}/channel`,
        // external_url: `${LENSTUBE_WEBSITE_URL}/channel/${selectedChannel?.handle}`,
        animation_url: uploadedLivestream.videoSource,
        image: uploadedLivestream.thumbnail,
        imageMimeType: uploadedLivestream.thumbnailType,
        name: trimify(uploadedLivestream.title),
        attributes,
        media,
        appId: LENSTUBE_APP_ID
      }
      if (uploadedLivestream.isSensitiveContent) {
        metadata.contentWarning = PublicationContentWarning.Sensitive
      }
      // const { url } = await uploadToAr(metadata)
      setUploadedLivestream({
        buttonText: 'Posting livestream...',
        loading: true
        // isByteVideo
      })
      const isRestricted = Boolean(
        uploadedLivestream.referenceModule?.degreesOfSeparationReferenceModule
          ?.degreesOfSeparation
      )
      const referenceModuleDegrees = {
        commentsRestricted: isRestricted,
        mirrorsRestricted: isRestricted,
        degreesOfSeparation: uploadedLivestream.referenceModule
          ?.degreesOfSeparationReferenceModule?.degreesOfSeparation as number
      }

      const request = {
        // profileId: selectedChannel?.id,
        // contentURI: url,
        collectModule: getCollectModule(uploadedLivestream.collectModule),
        referenceModule: {
          followerOnlyReferenceModule:
            uploadedLivestream.referenceModule?.followerOnlyReferenceModule,
          degreesOfSeparationReferenceModule: uploadedLivestream.referenceModule
            ?.degreesOfSeparationReferenceModule
            ? referenceModuleDegrees
            : null
        }
      }
      // const canUseDispatcher = selectedChannel?.dispatcher?.canUseRelay
      // if (!canUseDispatcher) {
      //   return signTypedData(request)
      // }
      // await createViaDispatcher(request)
    } catch (error) {
      logger.error('[Error Store & Post Livestream]', error)
    }
  }

  const onUpload = async (data: LivestreamVideoFormData) => {
    uploadedLivestream.title = data.livestreamName
    uploadedLivestream.livestreamName = data.livestreamName
    uploadedLivestream.description = data.description
    uploadedLivestream.isSensitiveContent = data.isSensitiveContent
    if (uploadedLivestream.isNSFW || uploadedLivestream.isNSFWThumbnail) {
      return toast.error('NSFW content not allowed')
    }
    if (!!uploadedLivestream.thumbnail) {
      uploadedLivestream.loading = true
      setUploadedLivestream({ ...uploadedLivestream })
      setShouldCreateLivestream(true)
    } else {
      toast.error('Please upload a thumbnail')
    }
  }

  useEffect(() => {
    if (shouldCreateLivestream && !!uploadedLivestream.livestreamName) {
      createLivestream && createLivestream()
      setShouldCreateLivestream(false)
    }
  }, [shouldCreateLivestream])

  // TODO: add lit protocol for stream key with ownerId requirement
  useEffect(() => {
    if (
      createLivestreamStatus === 'success' &&
      previousLivestreamStatus !== createLivestreamStatus &&
      !!createLivestreamData &&
      createLivestreamData?.streamKey &&
      createLivestreamData?.playbackId
    ) {
      createPublication()
    }
  }, [createLivestreamStatus, createLivestreamData, uploadedLivestream])

  return (
    <div className="mx-auto my-10 max-w-5xl gap-5">
      <MetaTags title="Livestream Details" />
      <div className="mt-10">
        <Details onCancel={resetToDefaults} onUpload={onUpload} />
      </div>
    </div>
  )
}

export default LivestreamCreationSteps
