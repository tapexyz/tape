import { LENSHUB_PROXY_ABI } from '@abis/LensHubProxy'
import { Button } from '@components/UIElements/Button'
import Modal from '@components/UIElements/Modal'
import { TextArea } from '@components/UIElements/TextArea'
import { zodResolver } from '@hookform/resolvers/zod'
import useHandleWrongNetwork from '@hooks/useHandleWrongNetwork'
import { Analytics, getUserLocale, TRACK } from '@lenstube/browser'
import {
  ERROR_MESSAGE,
  LENSHUB_PROXY_ADDRESS,
  LENSTUBE_APP_ID,
  LENSTUBE_WEBSITE_URL,
  REQUESTING_SIGNATURE_MESSAGE
} from '@lenstube/constants'
import {
  getOpenActionNftMetadata,
  getSignature,
  getURLs,
  trimify,
  uploadToAr,
  useZoraNft
} from '@lenstube/generic'
import type {
  CreateDataAvailabilityPostRequest,
  CreatePostBroadcastItemResult,
  CreatePublicPostRequest
} from '@lenstube/lens'
import {
  PublicationMainFocus,
  PublicationMetadataDisplayTypes,
  useBroadcastDataAvailabilityMutation,
  useBroadcastMutation,
  useCreateDataAvailabilityPostTypedDataMutation,
  useCreateDataAvailabilityPostViaDispatcherMutation,
  useCreatePostTypedDataMutation,
  useCreatePostViaDispatcherMutation
} from '@lenstube/lens'
import type {
  BasicNftMetadata,
  CustomErrorWithData
} from '@lenstube/lens/custom-types'
import useChannelStore from '@lib/store/channel'
import { t } from '@lingui/macro'
import type { FC } from 'react'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { v4 as uuidv4 } from 'uuid'
import { useContractWrite, useSignTypedData } from 'wagmi'
import type { z } from 'zod'
import { object, string } from 'zod'

type Props = {
  show: boolean
  setShow: React.Dispatch<boolean>
}

const formSchema = object({
  link: string().url({ message: 'Invalid URL' })
})
type FormData = z.infer<typeof formSchema>

const defaults: BasicNftMetadata = {
  chain: '',
  address: '',
  provider: 'zora',
  token: ''
}

const PostLinkModal: FC<Props> = ({ show, setShow }) => {
  const [basicNftMetadata, setBasicNftMetadata] =
    useState<BasicNftMetadata>(defaults)
  const [loading, setLoading] = useState(false)
  const handleWrongNetwork = useHandleWrongNetwork()

  const activeChannel = useChannelStore((state) => state.activeChannel)
  const canUseRelay = activeChannel?.dispatcher?.canUseRelay
  const isSponsored = activeChannel?.dispatcher?.sponsor

  const {
    register,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    reset,
    formState: { errors, isValid }
  } = useForm<FormData>({
    resolver: zodResolver(formSchema)
  })

  const { data } = useZoraNft({
    chain: basicNftMetadata?.chain,
    token: basicNftMetadata?.token,
    address: basicNftMetadata?.address,
    enabled: Boolean(basicNftMetadata?.address)
  })

  const link = watch('link')

  useEffect(() => {
    if (trimify(link)?.length) {
      const urls = getURLs(link)
      const nftMetadata = getOpenActionNftMetadata(urls)
      if (nftMetadata) {
        clearErrors()
        return setBasicNftMetadata(nftMetadata)
      }
      if (!nftMetadata) {
        setError('link', { message: 'Unsupported URL' })
      }
      setBasicNftMetadata(defaults)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [link])

  const onError = (error: CustomErrorWithData) => {
    toast.error(error?.data?.message ?? error?.message ?? ERROR_MESSAGE)
    setLoading(false)
  }

  const onCompleted = (__typename?: 'RelayError' | 'RelayerResult') => {
    if (__typename === 'RelayError') {
      return
    }
    Analytics.track(TRACK.PUBLICATION.NEW_POST, {
      type: 'link',
      publication_state: canUseRelay && isSponsored ? 'MOMOKA' : 'ON_CHAIN',
      user_id: activeChannel?.id
    })
    setLoading(false)
    reset()
    setBasicNftMetadata(defaults)
    toast.success('Link posted')
    setShow(false)
  }

  const { signTypedDataAsync } = useSignTypedData({
    onError
  })

  const [broadcast] = useBroadcastMutation({
    onCompleted: ({ broadcast }) => {
      onCompleted(broadcast.__typename)
    }
  })

  const { write } = useContractWrite({
    address: LENSHUB_PROXY_ADDRESS,
    abi: LENSHUB_PROXY_ABI,
    functionName: 'post',
    onSuccess: () => {
      setLoading(false)
    },
    onError
  })

  const getSignatureFromTypedData = async (
    data: CreatePostBroadcastItemResult
  ) => {
    const { typedData } = data
    toast.loading(REQUESTING_SIGNATURE_MESSAGE)
    const signature = await signTypedDataAsync(getSignature(typedData))
    return signature
  }

  /**
   * DATA AVAILABILITY STARTS
   */
  const [broadcastDataAvailabilityPost] = useBroadcastDataAvailabilityMutation({
    onCompleted: ({ broadcastDataAvailability }) => {
      onCompleted()
      if (broadcastDataAvailability.__typename === 'RelayError') {
        return toast.error(ERROR_MESSAGE)
      }
    },
    onError
  })

  const [createDataAvailabilityPostTypedData] =
    useCreateDataAvailabilityPostTypedDataMutation({
      onCompleted: async ({ createDataAvailabilityPostTypedData }) => {
        const { id } = createDataAvailabilityPostTypedData
        const signature = await getSignatureFromTypedData(
          createDataAvailabilityPostTypedData
        )
        return await broadcastDataAvailabilityPost({
          variables: { request: { id, signature } }
        })
      }
    })

  const [createDataAvailabilityPostViaDispatcher] =
    useCreateDataAvailabilityPostViaDispatcherMutation({
      onCompleted: ({ createDataAvailabilityPostViaDispatcher }) => {
        if (
          createDataAvailabilityPostViaDispatcher?.__typename === 'RelayError'
        ) {
          return
        }
        if (
          createDataAvailabilityPostViaDispatcher.__typename ===
          'CreateDataAvailabilityPublicationResult'
        ) {
          onCompleted()
        }
      },
      onError
    })
  /**
   * DATA AVAILABILITY ENDS
   */

  const [createPostViaDispatcher] = useCreatePostViaDispatcherMutation({
    onError,
    onCompleted: ({ createPostViaDispatcher }) => {
      onCompleted(createPostViaDispatcher.__typename)
    }
  })

  const [createPostTypedData] = useCreatePostTypedDataMutation({
    onCompleted: async ({ createPostTypedData }) => {
      const { typedData, id } =
        createPostTypedData as CreatePostBroadcastItemResult
      try {
        const signature = await getSignatureFromTypedData(createPostTypedData)
        const { data } = await broadcast({
          variables: { request: { id, signature } }
        })
        if (data?.broadcast?.__typename === 'RelayError') {
          return write?.({ args: [typedData.value] })
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

  const createViaDataAvailablityDispatcher = async (
    request: CreateDataAvailabilityPostRequest
  ) => {
    const variables = { request }

    const { data } = await createDataAvailabilityPostViaDispatcher({
      variables
    })

    if (
      data?.createDataAvailabilityPostViaDispatcher?.__typename === 'RelayError'
    ) {
      return await createDataAvailabilityPostTypedData({ variables })
    }
  }

  const onSubmit = async () => {
    if (handleWrongNetwork()) {
      return
    }
    setLoading(true)
    const metadata = {
      version: '2.0.0',
      metadata_id: uuidv4(),
      locale: getUserLocale(),
      mainContentFocus: PublicationMainFocus.Link,
      external_url: LENSTUBE_WEBSITE_URL,
      name: `${activeChannel?.handle} shared a link`,
      attributes: [
        {
          displayType: PublicationMetadataDisplayTypes.String,
          traitType: 'publication',
          value: 'link'
        },
        {
          displayType: PublicationMetadataDisplayTypes.String,
          traitType: 'app',
          value: LENSTUBE_APP_ID
        }
      ],
      content: `Check out this drop 📼 \n${link}`,
      image: null,
      media: [],
      appId: LENSTUBE_APP_ID
    }

    const metadataUri = await uploadToAr(metadata)

    const dataAvailablityRequest: CreateDataAvailabilityPostRequest = {
      from: activeChannel?.id,
      contentURI: metadataUri
    }
    const request: CreatePublicPostRequest = {
      profileId: activeChannel?.id,
      contentURI: metadataUri,
      collectModule: { revertCollectModule: true }
    }
    if (canUseRelay) {
      if (isSponsored) {
        return await createViaDataAvailablityDispatcher(dataAvailablityRequest)
      }
      return await createViaDispatcher(request)
    }
    return await createTypedData(request)
  }

  return (
    <div>
      <Modal
        title={t`Share a Drop`}
        description={t`Only zora links are supported at the moment.`}
        onClose={() => setShow(false)}
        show={show}
        panelClassName="max-w-lg"
      >
        <div className="no-scrollbar max-h-[40vh] overflow-y-auto p-0.5">
          <form className="mt-2" onSubmit={handleSubmit(onSubmit)}>
            <TextArea
              label="Absolute URL"
              placeholder="https://..."
              {...register('link')}
              validationError={errors.link?.message}
            />
            {data && (
              <div className="mt-4 rounded-xl border border-gray-200 p-5 dark:border-gray-800">
                <h6 className="text-xl font-bold">{data.name}</h6>
                <p className="line-clamp-2">{data.description}</p>
              </div>
            )}
            <div className="mt-4 flex items-center justify-end">
              <Button disabled={!isValid || !data || loading} loading={loading}>
                Post Link
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  )
}

export default PostLinkModal
