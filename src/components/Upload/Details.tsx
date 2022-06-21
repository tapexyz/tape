import { LENSHUB_PROXY_ABI } from '@abis/LensHubProxy'
import { useMutation } from '@apollo/client'
import { WebBundlr } from '@bundlr-network/client'
import PendingTxnLoader from '@components/Common/PendingTxnLoader'
import VideoPlayer from '@components/Common/VideoPlayer'
import { Button } from '@components/UIElements/Button'
import Tooltip from '@components/UIElements/Tooltip'
import useAppStore from '@lib/store'
import usePersistStore from '@lib/store/persist'
import {
  ARWEAVE_WEBSITE_URL,
  BUNDLR_CURRENCY,
  IPFS_GATEWAY,
  LENSHUB_PROXY_ADDRESS,
  LENSTUBE_APP_ID,
  RELAYER_ENABLED
} from '@utils/constants'
import { isEmptyString } from '@utils/functions/isEmptyString'
import omitKey from '@utils/functions/omitKey'
import { parseToAtomicUnits } from '@utils/functions/parseToAtomicUnits'
import { uploadDataToIPFS } from '@utils/functions/uploadToIPFS'
import { BROADCAST_MUTATION, CREATE_POST_TYPED_DATA } from '@utils/gql/queries'
import axios from 'axios'
import clsx from 'clsx'
import { utils } from 'ethers'
import React, { FC, useState } from 'react'
import toast from 'react-hot-toast'
import { BiCheck } from 'react-icons/bi'
import { CreatePostBroadcastItemResult } from 'src/types'
import {
  BundlrDataState,
  IPFSUploadResult,
  VideoUpload,
  VideoUploadForm
} from 'src/types/local'
import { v4 as uuidv4 } from 'uuid'
import {
  useAccount,
  useContractWrite,
  useSigner,
  useSignTypedData
} from 'wagmi'

import BundlrInfo from './BundlrInfo'
import Form from './Form'

type Props = {
  video: VideoUpload
  afterUpload: () => void
}

type PlayerProps = {
  source: string
}

const MemoizedVideoPlayer = React.memo(({ source }: PlayerProps) => (
  <VideoPlayer
    source={source}
    wrapperClassName="!rounded-b-none"
    autoPlay={false}
    ratio="16:9"
    controls={[
      'play',
      'progress',
      'current-time',
      'mute',
      'volume',
      'fullscreen'
    ]}
  />
))

MemoizedVideoPlayer.displayName = 'MemoizedVideoPlayer'

const Details: FC<Props> = ({ video, afterUpload }) => {
  const { data: account } = useAccount()
  const { data: signer } = useSigner()
  const { getBundlrInstance } = useAppStore()
  const { selectedChannel } = usePersistStore()
  const { signTypedDataAsync } = useSignTypedData({
    onError(error) {
      toast.error(error?.message)
      setDisableSubmit(false)
      setButtonText('Post Video')
    }
  })
  const [broadcast, { data: broadcastData }] = useMutation(BROADCAST_MUTATION, {
    onCompleted(data) {
      if (data?.broadcast?.reason !== 'NOT_ALLOWED') {
        setButtonText('Indexing...')
      }
    },
    onError(error) {
      toast.error(error.message)
      setDisableSubmit(false)
      setButtonText('Post Video')
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
        setButtonText('Indexing...')
      },
      onError(error: any) {
        toast.error(`Failed - ${error?.data?.message ?? error?.message}`)
        setDisableSubmit(false)
        setButtonText('Post Video')
      }
    }
  )

  const onIndexed = () => {
    afterUpload()
    setDisableSubmit(false)
    toast.success('Video posted successfully')
  }

  const [bundlrData, setBundlrData] = useState<BundlrDataState>({
    balance: '0',
    estimatedPrice: '0',
    deposit: null,
    instance: null,
    depositing: false,
    showDeposit: false
  })
  const [isUploadedToBundlr, setIsUploadedToBundlr] = useState(false)
  const [showBundlrDetails, setShowBundlrDetails] = useState(false)
  const [disableSubmit, setDisableSubmit] = useState(false)
  const [uploadToIpfs, setUploadToIpfs] = useState(false)
  const [uploadMeta, setUploadMeta] = useState({ uploading: false, percent: 0 })
  const [videoMeta, setVideoMeta] = useState<VideoUploadForm>({
    videoThumbnail: null,
    videoSource: null,
    playbackId: null,
    title: '',
    description: '',
    adultContent: false
  })
  const [buttonText, setButtonText] = useState('Next')

  const uploadToIpfsWithProgress = async () => {
    setButtonText('Uploading to IPFS...')
    setDisableSubmit(true)
    const formData = new FormData()
    formData.append('file', video.file as File, 'img')
    const response: { data: { Hash: string } } = await axios.post(
      'https://ipfs.infura.io:5001/api/v0/add',
      formData,
      {
        onUploadProgress: function (progressEvent) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          )
          setUploadMeta({ uploading: true, percent: percentCompleted })
        }
      }
    )
    if (response.data) {
      setButtonText('Processing...')
      const playbackId = await getPlaybackId(
        `${IPFS_GATEWAY}/${response.data.Hash}`
      )
      setVideoMeta((data) => {
        return {
          ...data,
          videoSource: `${IPFS_GATEWAY}/${response.data.Hash}`,
          playbackId
        }
      })
      setIsUploadedToBundlr(true)
      setButtonText('Post Video')
    } else {
      toast.error('Upload failed!')
      setButtonText('Next')
    }
    setDisableSubmit(false)
  }

  const isLessThan100MB = (bytes: number | undefined) =>
    bytes ? (bytes / 1024 ** 2 < 100 ? true : false) : false

  const onNext = async () => {
    const videoSize = video.file?.size
    if (isLessThan100MB(videoSize) && uploadToIpfs) {
      return uploadToIpfsWithProgress()
    }
    if (signer && account?.address) {
      setButtonText('Estimating cost...')
      toast('Requesting signature...')
      setDisableSubmit(true)
      const bundlr = await getBundlrInstance(signer)
      if (bundlr) {
        setBundlrData((bundlrData) => ({
          ...bundlrData,
          instance: bundlr
        }))
        setButtonText('Next')
        setShowBundlrDetails(true)
        await fetchBalance(bundlr)
        await estimatePrice(bundlr)
        setButtonText('Start Upload')
        setDisableSubmit(false)
      } else {
        setButtonText('Next')
        setDisableSubmit(false)
      }
    }
  }

  const depositToBundlr = async () => {
    if (bundlrData.instance && bundlrData.deposit) {
      const value = parseToAtomicUnits(
        parseFloat(bundlrData.deposit),
        bundlrData.instance.currencyConfig.base[1]
      )
      if (!value) return toast.error('Invalid deposit amount')
      setBundlrData({ ...bundlrData, depositing: true })
      await bundlrData.instance
        .fund(value)
        .then((res) => {
          toast.success(
            `Deposit of ${utils.formatEther(res?.quantity)} is done!`
          )
        })
        .catch((e) => {
          console.log('🚀 ~ file: Details.tsx ~ depositToBundlr ~ e', e)
          toast.error(`Failed to deposit`)
        })
        .finally(async () => {
          fetchBalance()
          setBundlrData({
            ...bundlrData,
            deposit: null,
            showDeposit: false,
            depositing: false
          })
        })
    }
  }

  const fetchBalance = async (bundlr?: WebBundlr) => {
    const instance = bundlr || bundlrData.instance
    if (account?.address && instance) {
      const balance = await instance.getBalance(account.address)
      setBundlrData((bundlrData) => ({
        ...bundlrData,
        balance: utils.formatEther(balance.toString())
      }))
    }
  }

  const estimatePrice = async (bundlr: WebBundlr) => {
    if (!video.buffer) return
    const price = await bundlr.utils.getPrice(
      BUNDLR_CURRENCY,
      video.buffer.length
    )
    setBundlrData((bundlrData) => ({
      ...bundlrData,
      estimatedPrice: utils.formatEther(price.toString())
    }))
  }

  const getPlaybackId = async (url: string) => {
    try {
      const playbackResponse = await fetch('/api/video/playback', {
        method: 'POST',
        body: JSON.stringify({
          url
        })
      })
      const { playbackId } = await playbackResponse.json()
      return playbackId
    } catch (error) {
      console.log('🚀 ~ file: Details.tsx ~ getPlaybackId ~ error', error)
      return null
    }
  }

  const uploadToBundlr = async () => {
    if (!bundlrData.instance || !video.buffer) return
    if (parseFloat(bundlrData.balance) < parseFloat(bundlrData.estimatedPrice))
      return toast.error('Insufficient balance')
    try {
      toast('Requesting signature...')
      const bundlr = bundlrData.instance
      setButtonText('Uploading to arweave...')
      setDisableSubmit(true)
      const tags = [{ name: 'Content-Type', value: 'video/mp4' }]
      const tx = bundlr.createTransaction(video.buffer, {
        tags: tags
      })
      await tx.sign()
      const response = await bundlr.uploader.chunkedTransactionUploader(
        tx.getRaw(),
        tx.id,
        tx.getRaw().length
      )
      setButtonText('Processing...')
      const playbackId = await getPlaybackId(
        `${ARWEAVE_WEBSITE_URL}/${response.data.id}`
      )
      fetchBalance(bundlr)
      setDisableSubmit(false)
      setVideoMeta((data) => {
        return {
          ...data,
          videoSource: `${ARWEAVE_WEBSITE_URL}/${response.data.id}`,
          playbackId
        }
      })
      setIsUploadedToBundlr(true)
      setButtonText('Post Video')
    } catch (error) {
      console.log('🚀 ~ file: Details.tsx ~ uploadToBundlr ~ error', error)
      toast.error('Failed to upload video!')
      setButtonText('Upload Video')
      setIsUploadedToBundlr(false)
      setDisableSubmit(false)
    }
  }

  const onThumbnailUpload = (data: IPFSUploadResult | null) => {
    if (data) {
      setVideoMeta((prev) => {
        return { ...prev, videoThumbnail: data }
      })
    } else {
      setVideoMeta((prev) => {
        return { ...prev, videoThumbnail: null }
      })
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
      setDisableSubmit(false)
      setButtonText('Post Video')
    }
  })

  const createPublication = async () => {
    setButtonText('Storing metadata...')
    setDisableSubmit(true)
    let media = [
      {
        item: videoMeta.videoSource,
        type: video.videoType
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
    if (videoMeta.playbackId) {
      media.push({
        item: `https://livepeercdn.com/asset/${videoMeta.playbackId}/video`,
        type: video.videoType
      })
    }
    if (videoMeta.adultContent) {
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
      description: videoMeta.description,
      content: `${videoMeta.title}\n\n${videoMeta.description}`,
      external_url: null,
      animation_url: videoMeta.videoSource,
      image: videoMeta.videoThumbnail?.ipfsUrl,
      cover: videoMeta.videoThumbnail?.ipfsUrl,
      imageMimeType: videoMeta.videoThumbnail?.type,
      name: videoMeta.title,
      attributes,
      media,
      appId: LENSTUBE_APP_ID
    })
    setButtonText('Submitting Txn...')
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

  const onSubmitForm = async () => {
    if (
      isEmptyString(videoMeta.title) ||
      isEmptyString(videoMeta.videoThumbnail?.ipfsUrl)
    ) {
      return toast.error('Fill out all fields.')
    }
    if (videoMeta.title.length > 100 || videoMeta.description.length > 5000) {
      return toast.error('Content length exceeds the limit.')
    }
    if (!isUploadedToBundlr && bundlrData.instance) {
      await uploadToBundlr()
    } else if (videoMeta.videoSource && isUploadedToBundlr) {
      await createPublication()
    } else {
      await onNext()
    }
  }

  return (
    <div className="max-w-6xl gap-5 mx-auto">
      <div className="grid h-full gap-5 md:grid-cols-2">
        <Form
          video={video}
          videoMeta={videoMeta}
          setVideoMeta={setVideoMeta}
          onThumbnailUpload={onThumbnailUpload}
        />
        <div className="flex flex-col items-start">
          <div
            className={clsx('overflow-hidden w-full', {
              'rounded-t-lg': uploadMeta.uploading,
              'rounded-lg': !uploadMeta.uploading
            })}
          >
            <MemoizedVideoPlayer source={video.preview} />
          </div>
          <Tooltip content={`Uploaded (${uploadMeta.percent}%)`}>
            <div className="w-full overflow-hidden bg-gray-200 rounded-b-full">
              <div
                className={clsx('bg-indigo-800 bg-brand-500', {
                  'h-[6px]': uploadMeta.uploading,
                  'h-0': !uploadMeta.uploading
                })}
                style={{
                  width: `${uploadMeta.percent}%`
                }}
              />
            </div>
          </Tooltip>

          {isLessThan100MB(video.file?.size) && !showBundlrDetails ? (
            <div className="mt-2">
              <span className="text-sm opacity-60">
                This video size is less than 100MB and can be uploaded to IPFS
                for free,
                <br /> would you like to proceed?
              </span>
              {uploadToIpfs ? (
                <button
                  onClick={() => setUploadToIpfs(false)}
                  className="ml-2 text-green-500 outline-none"
                >
                  <BiCheck />
                </button>
              ) : (
                <button
                  onClick={() => setUploadToIpfs(true)}
                  className="ml-2 text-sm text-indigo-500 outline-none"
                >
                  Yes
                </button>
              )}
            </div>
          ) : (
            <span className="mt-2 text-sm opacity-60">
              This video will be uploaded to Arweave permanent storage.
            </span>
          )}

          {showBundlrDetails && (
            <BundlrInfo
              bundlrData={bundlrData}
              setBundlrData={setBundlrData}
              depositToBundlr={depositToBundlr}
              fetchBalance={fetchBalance}
            />
          )}
        </div>
      </div>
      <div className="flex items-center justify-end mt-3">
        <span className="mr-4">
          {videoMeta.videoSource && (
            <span className="text-xs text-green-500">Video uploaded</span>
          )}
        </span>
        {writePostData?.hash || broadcastData?.broadcast?.txHash ? (
          <PendingTxnLoader
            txnHash={broadcastData?.broadcast?.txHash ?? writePostData?.hash}
            onIndexed={() => onIndexed()}
            isPublication={true}
          />
        ) : (
          <Button disabled={disableSubmit} onClick={() => onSubmitForm()}>
            {buttonText}
          </Button>
        )}
      </div>
    </div>
  )
}

export default Details
