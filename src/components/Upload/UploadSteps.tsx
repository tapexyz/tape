import { LENSHUB_PROXY_ABI } from '@abis/LensHubProxy'
import { useMutation } from '@apollo/client'
import MetaTags from '@components/Common/MetaTags'
import useAppStore, { UPLOADED_VIDEO_FORM_DEFAULTS } from '@lib/store'
import usePersistStore from '@lib/store/persist'
import * as Sentry from '@sentry/nextjs'
import {
  ARWEAVE_WEBSITE_URL,
  IPFS_GATEWAY,
  LENSHUB_PROXY_ADDRESS,
  LENSTUBE_APP_ID,
  RELAYER_ENABLED
} from '@utils/constants'
import { isLessThan100MB } from '@utils/functions/getSizeFromBytes'
import omitKey from '@utils/functions/omitKey'
import { uploadDataToIPFS } from '@utils/functions/uploadToIPFS'
import { BROADCAST_MUTATION, CREATE_POST_TYPED_DATA } from '@utils/gql/queries'
import usePendingTxn from '@utils/hooks/usePendingTxn'
import axios from 'axios'
import { utils } from 'ethers'
import React, { useEffect } from 'react'
import toast from 'react-hot-toast'
import { CreatePostBroadcastItemResult } from 'src/types'
import { v4 as uuidv4 } from 'uuid'
import { useContractWrite, useSignTypedData } from 'wagmi'

import Details, { VideoFormData } from './Details'

const UploadSteps = () => {
  const { setUploadedVideo, uploadedVideo, bundlrData } = useAppStore()
  const { selectedChannel } = usePersistStore()

  const { signTypedDataAsync } = useSignTypedData({
    onError(error) {
      toast.error(error?.message)
      setUploadedVideo({
        ...uploadedVideo,
        buttonText: 'Post Video',
        loading: false
      })
    }
  })
  const [broadcast, { data: broadcastData }] = useMutation(BROADCAST_MUTATION, {
    onCompleted(data) {
      if (data?.broadcast?.reason !== 'NOT_ALLOWED') {
        setUploadedVideo({
          ...uploadedVideo,
          buttonText: 'Indexing...',
          loading: true
        })
      }
    },
    onError(error) {
      toast.error(error.message)
      setUploadedVideo({
        ...uploadedVideo,
        buttonText: 'Post Video',
        loading: false
      })
    }
  })
  const { data: writePostData, write: writePostContract } = useContractWrite(
    {
      addressOrName: LENSHUB_PROXY_ADDRESS,
      contractInterface: LENSHUB_PROXY_ABI
    },
    'postWithSig',
    {
      onSuccess() {
        setUploadedVideo({
          ...uploadedVideo,
          buttonText: 'Indexing...',
          loading: true
        })
      },
      onError(error: any) {
        toast.error(`Failed - ${error?.data?.message ?? error?.message}`)
        setUploadedVideo({
          ...uploadedVideo,
          buttonText: 'Post Video',
          loading: false
        })
      }
    }
  )

  const { indexed } = usePendingTxn(
    writePostData?.hash || broadcastData?.broadcast?.txHash,
    true
  )

  useEffect(() => {
    if (indexed) {
      setUploadedVideo(UPLOADED_VIDEO_FORM_DEFAULTS)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indexed])

  const getPlaybackId = async (url: string) => {
    try {
      const playbackResponse = await axios.post('/api/video/playback', {
        url
      })
      const { playbackId } = playbackResponse.data
      return playbackId
    } catch (error) {
      Sentry.captureException(error)
      return null
    }
  }

  const uploadToBundlr = async (data: VideoFormData) => {
    if (!bundlrData.instance || !uploadedVideo.buffer) return
    if (parseFloat(bundlrData.balance) < parseFloat(bundlrData.estimatedPrice))
      return toast.error('Insufficient balance')
    try {
      setUploadedVideo({
        ...uploadedVideo,
        ...data,
        loading: true,
        buttonText: 'Uploading to Arweave...'
      })
      const bundlr = bundlrData.instance
      const tags = [{ name: 'Content-Type', value: 'video/mp4' }]
      const tx = bundlr.createTransaction(uploadedVideo.buffer, {
        tags: tags
      })
      await tx.sign()
      const response = await bundlr.uploader.chunkedTransactionUploader(
        tx.getRaw(),
        tx.id,
        tx.getRaw().length
      )
      const playbackId = await getPlaybackId(
        `${ARWEAVE_WEBSITE_URL}/${response.data.id}`
      )
      setUploadedVideo({
        ...uploadedVideo,
        ...data,
        videoSource: `${ARWEAVE_WEBSITE_URL}/${response.data.id}`,
        playbackId,
        buttonText: 'Post Video',
        loading: false
      })
    } catch (error: any) {
      toast.error('Failed to upload video!')
      Sentry.captureException(error)
    }
  }

  const uploadToIpfsWithProgress = async (data: VideoFormData) => {
    toast('Uploading to IPFS...')
    const formData = new FormData()
    formData.append('file', uploadedVideo.file as File, 'img')
    const response: { data: { Hash: string } } = await axios.post(
      'https://ipfs.infura.io:5001/api/v0/add',
      formData,
      {
        onUploadProgress: function (progressEvent) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          )
          setUploadedVideo({
            ...uploadedVideo,
            buttonText: 'Uploading...',
            loading: true,
            percent: percentCompleted,
            ...data
          })
        }
      }
    )
    if (response.data) {
      const playbackId = await getPlaybackId(
        `${IPFS_GATEWAY}/${response.data.Hash}`
      )
      setUploadedVideo({
        ...uploadedVideo,
        ...data,
        percent: 100,
        videoSource: `${IPFS_GATEWAY}/${response.data.Hash}`,
        playbackId,
        buttonText: 'Post Video'
      })
    } else {
      toast.error('Upload failed!')
    }
  }

  const [createTypedData] = useMutation(CREATE_POST_TYPED_DATA, {
    onCompleted({
      createPostTypedData
    }: {
      createPostTypedData: CreatePostBroadcastItemResult
    }) {
      const { typedData, id } = createPostTypedData
      const {
        profileId,
        contentURI,
        collectModule,
        collectModuleInitData,
        referenceModule,
        referenceModuleInitData
      } = typedData?.value
      signTypedDataAsync({
        domain: omitKey(typedData?.domain, '__typename'),
        types: omitKey(typedData?.types, '__typename'),
        value: omitKey(typedData?.value, '__typename')
      }).then((signature) => {
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
        if (RELAYER_ENABLED) {
          broadcast({ variables: { request: { id, signature } } })
        } else {
          writePostContract({
            args
          })
        }
      })
    },
    onError(error) {
      toast.error(error.message)
      setUploadedVideo({
        ...uploadedVideo,
        buttonText: 'Post Video',
        loading: false
      })
    }
  })

  const createPublication = async () => {
    setUploadedVideo({
      ...uploadedVideo,
      buttonText: 'Storing metadata...',
      loading: true
    })
    let media = [
      {
        item: uploadedVideo.videoSource,
        type: uploadedVideo.videoType
      }
    ]
    let attributes = [
      {
        traitType: 'string',
        key: 'publication',
        trait_type: 'publication',
        value: 'video'
      },
      {
        traitType: 'string',
        trait_type: 'handle',
        key: 'handle',
        value: `@${selectedChannel?.handle}`
      },
      {
        traitType: 'string',
        key: 'app',
        trait_type: 'app',
        value: 'lenstube'
      }
    ]
    if (uploadedVideo.playbackId) {
      media.push({
        item: `https://livepeercdn.com/asset/${uploadedVideo.playbackId}/video`,
        type: uploadedVideo.videoType
      })
    }
    if (uploadedVideo.isAdultContent) {
      attributes.push({
        traitType: 'string',
        trait_type: 'content',
        key: 'content',
        value: 'sensitive'
      })
    }
    const { ipfsUrl } = await uploadDataToIPFS({
      version: '1.0.0',
      metadata_id: uuidv4(),
      description: uploadedVideo.description,
      content: `${uploadedVideo.title}\n\n${uploadedVideo.description}`,
      external_url: null,
      animation_url: uploadedVideo.videoSource,
      image: uploadedVideo.thumbnail,
      cover: uploadedVideo.thumbnail,
      imageMimeType: uploadedVideo.thumbnailType,
      name: uploadedVideo.title,
      attributes,
      media,
      appId: LENSTUBE_APP_ID
    })
    setUploadedVideo({
      ...uploadedVideo,
      buttonText: 'Posting video...',
      loading: true
    })
    // TODO: Add fields to select collect and reference module
    createTypedData({
      variables: {
        request: {
          profileId: selectedChannel?.id,
          contentURI: ipfsUrl,
          collectModule: {
            freeCollectModule: {
              followerOnly: false
            }
          },
          referenceModule: {
            followerOnlyReferenceModule: false
          }
        }
      }
    })
  }

  const onUpload = (data: VideoFormData) => {
    if (uploadedVideo.videoSource) return createPublication()
    else {
      if (
        isLessThan100MB(uploadedVideo.file?.size) &&
        uploadedVideo.isUploadToIpfs
      ) {
        return uploadToIpfsWithProgress(data)
      } else uploadToBundlr(data)
    }
  }

  const onCancel = () => {
    setUploadedVideo(UPLOADED_VIDEO_FORM_DEFAULTS)
  }

  return (
    <div className="max-w-5xl gap-5 mx-auto my-10">
      <MetaTags title="Video Details" />
      <div className="mt-10">
        <Details onCancel={onCancel} onUpload={onUpload} />
      </div>
    </div>
  )
}

export default UploadSteps
