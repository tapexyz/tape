import { LENSHUB_PROXY_ABI } from '@abis/LensHubProxy'
import { useMutation } from '@apollo/client'
import MetaTags from '@components/Common/MetaTags'
import useAppStore, { UPLOADED_VIDEO_FORM_DEFAULTS } from '@lib/store'
import usePersistStore from '@lib/store/persist'
import * as Sentry from '@sentry/nextjs'
import {
  ARWEAVE_WEBSITE_URL,
  IPFS_GATEWAY,
  IPFS_HTTP_API,
  IS_MAINNET,
  LENSHUB_PROXY_ADDRESS,
  LENSTUBE_APP_ID,
  LENSTUBE_URL,
  RELAYER_ENABLED
} from '@utils/constants'
import { getCollectModule } from '@utils/functions/getCollectModule'
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
import {
  useAccount,
  useContractWrite,
  useSigner,
  useSignTypedData
} from 'wagmi'

import Details from './Details'

const UploadSteps = () => {
  const {
    setUploadedVideo,
    uploadedVideo,
    bundlrData,
    setBundlrData,
    getBundlrInstance
  } = useAppStore()
  const { selectedChannel } = usePersistStore()
  const { address } = useAccount()
  const { data: signer } = useSigner({
    onError(error: any) {
      toast.error(error?.data?.message ?? error?.message)
    }
  })

  const onError = () => {
    setUploadedVideo({
      buttonText: 'Post Video',
      loading: false
    })
  }

  const { signTypedDataAsync } = useSignTypedData({
    onError(error) {
      toast.error(error?.message)
      onError()
    }
  })
  const [broadcast, { data: broadcastData }] = useMutation(BROADCAST_MUTATION, {
    onCompleted(data) {
      if (data?.broadcast?.reason !== 'NOT_ALLOWED') {
        setUploadedVideo({
          buttonText: 'Indexing...',
          loading: true
        })
      }
    },
    onError(error) {
      toast.error(error.message)
      onError()
    }
  })
  const { data: writePostData, write: writePostContract } = useContractWrite({
    addressOrName: LENSHUB_PROXY_ADDRESS,
    contractInterface: LENSHUB_PROXY_ABI,
    functionName: 'postWithSig',
    onSuccess() {
      setUploadedVideo({
        buttonText: 'Indexing...',
        loading: true
      })
    },
    onError(error: any) {
      toast.error(error?.data?.message ?? error?.message)
      onError()
    }
  })

  const { indexed } = usePendingTxn(
    writePostData?.hash || broadcastData?.broadcast?.txHash,
    true
  )

  useEffect(() => {
    if (indexed) setUploadedVideo(UPLOADED_VIDEO_FORM_DEFAULTS)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indexed])

  const getPlaybackId = async (url: string) => {
    // Only on production
    if (!IS_MAINNET) return null
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

  const initBundlr = async () => {
    if (signer?.provider && address && !bundlrData.instance) {
      toast('Estimating upload cost...')
      const bundlr = await getBundlrInstance(signer)
      if (bundlr) {
        setBundlrData({ instance: bundlr })
      }
    }
  }

  const uploadToBundlr = async () => {
    if (!bundlrData.instance) return initBundlr()
    if (!uploadedVideo.buffer)
      return toast.error('Video not uploaded correctly.')
    if (parseFloat(bundlrData.balance) < parseFloat(bundlrData.estimatedPrice))
      return toast.error('Insufficient balance')
    try {
      setUploadedVideo({
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
        videoSource: `${ARWEAVE_WEBSITE_URL}/${response.data.id}`,
        playbackId,
        buttonText: 'Post Video',
        loading: false
      })
    } catch (error: any) {
      if (error.code !== 4001) Sentry.captureException(error)
      toast.error('Failed to upload video!')
      setUploadedVideo({
        buttonText: 'Upload Video',
        loading: false
      })
    }
  }

  const uploadToIpfsWithProgress = async () => {
    try {
      toast('Uploading to IPFS...')
      const formData = new FormData()
      formData.append('file', uploadedVideo.file as File, 'img')
      const response: { data: { Hash: string } } = await axios.post(
        IPFS_HTTP_API,
        formData,
        {
          onUploadProgress: function (progressEvent) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            )
            setUploadedVideo({
              buttonText: 'Uploading...',
              loading: true,
              percent: percentCompleted
            })
          }
        }
      )
      if (response.data) {
        const playbackId = await getPlaybackId(
          `${IPFS_GATEWAY}/${response.data.Hash}`
        )
        setUploadedVideo({
          percent: 100,
          videoSource: `${IPFS_GATEWAY}/${response.data.Hash}`,
          playbackId,
          buttonText: 'Post Video',
          loading: false
        })
      } else {
        toast.error('Upload failed!')
      }
    } catch (error: any) {
      toast.error(error.message)
      console.log(error)
    }
  }

  const [createTypedData] = useMutation(CREATE_POST_TYPED_DATA, {
    async onCompleted(data) {
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
        if (RELAYER_ENABLED) {
          const { data } = await broadcast({
            variables: { request: { id, signature } }
          })
          if (data?.broadcast?.reason) writePostContract({ args })
        } else writePostContract({ args })
      } catch (error) {
        onError()
      }
    },
    onError(error) {
      toast.error(error.message)
      onError()
    }
  })

  const createPublication = async () => {
    setUploadedVideo({
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
        displayType: 'string',
        traitType: 'publication',
        key: 'publication',
        value: 'video'
      },
      {
        displayType: 'string',
        traitType: 'handle',
        key: 'handle',
        value: `@${selectedChannel?.handle}`
      },
      {
        displayType: 'string',
        traitType: 'app',
        key: 'app',
        value: 'lenstube'
      }
    ]
    if (uploadedVideo.playbackId) {
      media.push({
        item: `https://livepeercdn.com/asset/${uploadedVideo.playbackId}/video`,
        type: uploadedVideo.videoType
      })
    }
    if (uploadedVideo.durationInSeconds) {
      attributes.push({
        displayType: 'string',
        traitType: 'durationInSeconds',
        key: 'durationInSeconds',
        value: uploadedVideo.durationInSeconds.toString()
      })
    }
    if (uploadedVideo.isAdultContent) {
      attributes.push({
        displayType: 'string',
        traitType: 'content',
        key: 'content',
        value: 'sensitive'
      })
    }
    const { ipfsUrl } = await uploadDataToIPFS({
      version: '1.0.0',
      metadata_id: uuidv4(),
      description: uploadedVideo.description,
      content: `${uploadedVideo.title}\n\n${uploadedVideo.description}`,
      external_url: LENSTUBE_URL,
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
      buttonText: 'Posting video...',
      loading: true
    })
    createTypedData({
      variables: {
        request: {
          profileId: selectedChannel?.id,
          contentURI: ipfsUrl,
          collectModule: getCollectModule(uploadedVideo.collectModule),
          referenceModule: {
            followerOnlyReferenceModule: uploadedVideo.disableComments
          }
        }
      }
    })
  }

  const onUpload = () => {
    if (uploadedVideo.videoSource) return createPublication()
    else {
      if (
        isLessThan100MB(uploadedVideo.file?.size) &&
        uploadedVideo.isUploadToIpfs
      ) {
        return uploadToIpfsWithProgress()
      } else uploadToBundlr()
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
