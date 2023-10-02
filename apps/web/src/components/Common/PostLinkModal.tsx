import { LENSHUB_PROXY_ABI } from '@abis/LensHubProxy'
import { Button } from '@components/UIElements/Button'
import Modal from '@components/UIElements/Modal'
import { TextArea } from '@components/UIElements/TextArea'
import { zodResolver } from '@hookform/resolvers/zod'
import type { MetadataAttribute } from '@lens-protocol/metadata'
import { link, MetadataAttributeType } from '@lens-protocol/metadata'
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
  CreateMomokaPostEip712TypedData,
  CreateOnchainPostEip712TypedData
} from '@lenstube/lens'
import {
  useBroadcastOnMomokaMutation,
  useCreateMomokaPostTypedDataMutation,
  usePostOnMomokaMutation
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

  const activeChannel = useChannelStore((state) => state.activeChannel)
  const canUseRelay = activeChannel?.lensManager && activeChannel?.sponsor

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

  const linkText = watch('link')

  useEffect(() => {
    if (trimify(linkText)?.length) {
      const urls = getURLs(linkText)
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
  }, [linkText])

  const onError = (error: CustomErrorWithData) => {
    toast.error(error?.data?.message ?? error?.message ?? ERROR_MESSAGE)
    setLoading(false)
  }

  const onCompleted = (__typename?: 'RelayError' | 'RelaySuccess') => {
    if (__typename === 'RelayError') {
      return
    }
    setLoading(false)
    reset()
    setBasicNftMetadata(defaults)
    toast.success('Link posted')
    setShow(false)
    Analytics.track(TRACK.PUBLICATION.NEW_POST, {
      type: 'link',
      publication_state: canUseRelay ? 'MOMOKA' : 'ON_CHAIN',
      user_id: activeChannel?.id
    })
  }

  const { signTypedDataAsync } = useSignTypedData({
    onError
  })

  const { write } = useContractWrite({
    address: LENSHUB_PROXY_ADDRESS,
    abi: LENSHUB_PROXY_ABI,
    functionName: 'post',
    onSuccess: () => {
      onCompleted()
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

  const [broadcastOnMomoka] = useBroadcastOnMomokaMutation({
    onCompleted: ({ broadcastOnMomoka }) => {
      if (broadcastOnMomoka.__typename === 'CreateMomokaPublicationResult') {
        onCompleted()
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
        onCompleted()
      }
    }
  })

  const onSubmit = async () => {
    setLoading(true)

    const attributes: MetadataAttribute[] = [
      {
        type: MetadataAttributeType.STRING,
        key: 'publication',
        value: 'link'
      },
      {
        type: MetadataAttributeType.STRING,
        key: 'app',
        value: LENSTUBE_APP_ID
      }
    ]
    const linkMetadata = link({
      sharingLink: linkText,
      appId: LENSTUBE_APP_ID,
      id: uuidv4(),
      content: `Check out this drop 📼 \n${linkText}`,
      locale: getUserLocale(),
      marketplace: {
        name: `Link by @${activeChannel?.handle}`,
        attributes,
        description: linkText,
        external_url: LENSTUBE_WEBSITE_URL
      },
      attributes
    })

    const metadataUri = await uploadToAr(linkMetadata)
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
