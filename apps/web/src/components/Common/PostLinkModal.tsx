import { TextArea } from '@components/UIElements/TextArea'
import { zodResolver } from '@hookform/resolvers/zod'
import useHandleWrongNetwork from '@hooks/useHandleWrongNetwork'
import { useZoraNft } from '@hooks/useZoraNft'
import type { MetadataAttribute } from '@lens-protocol/metadata'
import { link, MetadataAttributeType } from '@lens-protocol/metadata'
import useProfileStore from '@lib/store/profile'
import { Trans } from '@lingui/macro'
import { Button, Dialog, Flex } from '@radix-ui/themes'
import { LENSHUB_PROXY_ABI } from '@tape.xyz/abis'
import { getUserLocale } from '@tape.xyz/browser'
import {
  ERROR_MESSAGE,
  LENSHUB_PROXY_ADDRESS,
  REQUESTING_SIGNATURE_MESSAGE,
  TAPE_APP_ID,
  TAPE_WEBSITE_URL
} from '@tape.xyz/constants'
import {
  EVENTS,
  getOpenActionNftMetadata,
  getProfile,
  getSignature,
  getURLs,
  Tower,
  trimify,
  uploadToAr
} from '@tape.xyz/generic'
import type {
  CreateMomokaPostEip712TypedData,
  CreateOnchainPostEip712TypedData,
  Profile
} from '@tape.xyz/lens'
import {
  useBroadcastOnMomokaMutation,
  useCreateMomokaPostTypedDataMutation,
  usePostOnMomokaMutation
} from '@tape.xyz/lens'
import type {
  BasicNftMetadata,
  CustomErrorWithData
} from '@tape.xyz/lens/custom-types'
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

  const activeProfile = useProfileStore(
    (state) => state.activeProfile
  ) as Profile
  const canUseRelay = activeProfile?.lensManager && activeProfile?.sponsor

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
    Tower.track(EVENTS.PUBLICATION.NEW_POST, {
      type: 'link',
      publication_state: canUseRelay ? 'MOMOKA' : 'ON_CHAIN',
      user_id: activeProfile?.id
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
    if (handleWrongNetwork()) {
      return
    }
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
        value: TAPE_APP_ID
      }
    ]
    const linkMetadata = link({
      sharingLink: linkText,
      appId: TAPE_WEBSITE_URL,
      id: uuidv4(),
      content: `Check out this drop 📼 \n${linkText}`,
      locale: getUserLocale(),
      marketplace: {
        name: `Link by @${getProfile(activeProfile)?.slug}`,
        attributes,
        description: linkText,
        external_url: TAPE_WEBSITE_URL
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
      <Dialog.Root open={show} onOpenChange={setShow}>
        <Dialog.Content>
          <Dialog.Title>
            <Trans>Share a Drop</Trans>
          </Dialog.Title>
          <Dialog.Description size="2" mb="4">
            <Trans>Only zora links are supported at the moment.</Trans>
          </Dialog.Description>
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
              <Flex gap="3" mt="4" justify="end">
                <Dialog.Close>
                  <Button variant="soft" color="gray">
                    Cancel
                  </Button>
                </Dialog.Close>
                <Button highContrast disabled={!isValid || !data || loading}>
                  Post Link
                </Button>
              </Flex>
            </form>
          </div>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  )
}

export default PostLinkModal
