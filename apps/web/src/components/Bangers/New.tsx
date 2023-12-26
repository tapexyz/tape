import type { MetadataAttribute } from '@lens-protocol/metadata'
import type {
  CreateMomokaPostEip712TypedData,
  CreateOnchainPostEip712TypedData
} from '@tape.xyz/lens'
import type { CustomErrorWithData } from '@tape.xyz/lens/custom-types'
import type { FC } from 'react'
import type { z } from 'zod'

import TimesOutline from '@components/Common/Icons/TimesOutline'
import { Input } from '@components/UIElements/Input'
import { zodResolver } from '@hookform/resolvers/zod'
import useHandleWrongNetwork from '@hooks/useHandleWrongNetwork'
import { link, MetadataAttributeType } from '@lens-protocol/metadata'
import useProfileStore from '@lib/store/idb/profile'
import useNonceStore from '@lib/store/nonce'
import { Button, Dialog, DialogClose, Flex, IconButton } from '@radix-ui/themes'
import { LENSHUB_PROXY_ABI } from '@tape.xyz/abis'
import { getUserLocale } from '@tape.xyz/browser'
import {
  COMMON_REGEX,
  ERROR_MESSAGE,
  FALLBACK_COVER_URL,
  LENSHUB_PROXY_ADDRESS,
  OG_IMAGE,
  REQUESTING_SIGNATURE_MESSAGE,
  SIGN_IN_REQUIRED,
  TAPE_APP_ID,
  TAPE_WEBSITE_URL
} from '@tape.xyz/constants'
import {
  checkLensManagerPermissions,
  EVENTS,
  getProfile,
  getSignature,
  imageCdn,
  Tower,
  trimify,
  uploadToAr
} from '@tape.xyz/generic'
import {
  useBroadcastOnMomokaMutation,
  useCreateMomokaPostTypedDataMutation,
  usePostOnMomokaMutation
} from '@tape.xyz/lens'
import { Loader } from '@tape.xyz/ui'
import Link from 'next/link'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { v4 as uuidv4 } from 'uuid'
import { useContractWrite, useSignTypedData } from 'wagmi'
import { object, string } from 'zod'

const VALID_URL_REGEX = new RegExp(
  `${COMMON_REGEX.YOUTUBE_WATCH.source}|${COMMON_REGEX.TAPE_WATCH.source}|${COMMON_REGEX.VIMEO_WATCH.source}`
)

const formSchema = object({
  link: string()
    .url({ message: 'Invalid URL' })
    .regex(VALID_URL_REGEX, { message: 'Unsupported URL' })
})
type FormData = z.infer<typeof formSchema>

type Props = {
  refetch: () => void
}

const New: FC<Props> = ({ refetch }) => {
  const {
    formState: { errors },
    getValues,
    handleSubmit,
    register,
    reset
  } = useForm<FormData>({
    resolver: zodResolver(formSchema)
  })
  const [loading, setLoading] = useState(false)
  const activeProfile = useProfileStore((state) => state.activeProfile)
  const handleWrongNetwork = useHandleWrongNetwork()
  const { canBroadcast, canUseLensManager } =
    checkLensManagerPermissions(activeProfile)
  const lensHubOnchainSigNonce = useNonceStore(
    (state) => state.lensHubOnchainSigNonce
  )
  const setLensHubOnchainSigNonce = useNonceStore(
    (state) => state.setLensHubOnchainSigNonce
  )

  const onError = (error: CustomErrorWithData) => {
    toast.error(error?.data?.message ?? error?.message ?? ERROR_MESSAGE)
    setLoading(false)
  }

  const onCompleted = (
    __typename?: 'CreateMomokaPublicationResult' | 'RelayError' | 'RelaySuccess'
  ) => {
    if (__typename === 'RelayError') {
      return
    }
    setLoading(false)
    reset()
    refetch()
    toast.success('Posted successfully!')
    Tower.track(EVENTS.PUBLICATION.NEW_POST, {
      publication_state: canUseLensManager ? 'MOMOKA' : 'ON_CHAIN',
      type: 'banger',
      user_id: activeProfile?.id
    })
    if (!canUseLensManager) {
      location.reload()
    }
  }

  const { signTypedDataAsync } = useSignTypedData({
    onError
  })

  const getSignatureFromTypedData = async (
    data: CreateMomokaPostEip712TypedData | CreateOnchainPostEip712TypedData
  ) => {
    toast.loading(REQUESTING_SIGNATURE_MESSAGE)
    const signature = await signTypedDataAsync(getSignature(data))
    return signature
  }

  const { write } = useContractWrite({
    abi: LENSHUB_PROXY_ABI,
    address: LENSHUB_PROXY_ADDRESS,
    functionName: 'post',
    onError: (error) => {
      onError(error)
      setLensHubOnchainSigNonce(lensHubOnchainSigNonce - 1)
    },
    onSuccess: () => {
      setLoading(false)
      setLensHubOnchainSigNonce(lensHubOnchainSigNonce + 1)
      onCompleted()
    }
  })

  const [broadcastOnMomoka] = useBroadcastOnMomokaMutation({
    onCompleted: ({ broadcastOnMomoka }) => {
      if (broadcastOnMomoka.__typename === 'CreateMomokaPublicationResult') {
        onCompleted(broadcastOnMomoka.__typename)
      }
    }
  })

  const [createMomokaPostTypedData] = useCreateMomokaPostTypedDataMutation({
    onCompleted: async ({ createMomokaPostTypedData }) => {
      const { id, typedData } = createMomokaPostTypedData
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
      } catch {}
    },
    onError
  })

  const [postOnMomoka] = usePostOnMomokaMutation({
    onCompleted: ({ postOnMomoka }) => {
      if (postOnMomoka.__typename === 'CreateMomokaPublicationResult') {
        onCompleted(postOnMomoka.__typename)
      }
    },
    onError
  })

  const onSubmit = async () => {
    if (!activeProfile) {
      return toast.error(SIGN_IN_REQUIRED)
    }
    if (handleWrongNetwork()) {
      return
    }
    setLoading(true)
    const linkText = trimify(getValues('link'))
    const attributes: MetadataAttribute[] = [
      {
        key: 'publication',
        type: MetadataAttributeType.STRING,
        value: 'banger'
      }
    ]
    const linkMetadata = link({
      appId: TAPE_APP_ID,
      attributes,
      content: `Only Bangers by Tape 📼 \n${TAPE_WEBSITE_URL}/bangers`,
      id: uuidv4(),
      locale: getUserLocale(),
      marketplace: {
        attributes,
        description: linkText,
        external_url: `${TAPE_WEBSITE_URL}/bangers`,
        image: OG_IMAGE,
        name: `Banger by @${getProfile(activeProfile)?.slug}`
      },
      sharingLink: linkText,
      tags: ['banger']
    })
    const metadataUri = await uploadToAr(linkMetadata)

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

  return (
    <div
      className="relative h-44 w-full bg-gray-300 bg-cover bg-center bg-no-repeat dark:bg-gray-700 md:h-[30vh]"
      style={{
        backgroundImage: `url("${imageCdn(FALLBACK_COVER_URL)}")`
      }}
    >
      <fieldset
        className="container mx-auto flex h-full max-w-screen-sm flex-col items-center justify-center space-y-4 px-4 md:px-0"
        disabled={loading}
      >
        <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex space-x-2">
            <Input
              autoComplete="off"
              className="bg-white dark:bg-black"
              placeholder="Paste a link to a banger"
              title="Tape/YouTube/Vimeo links supported"
              validationError={errors.link?.message}
              {...register('link')}
            />
            <Button disabled={loading} highContrast>
              {loading && <Loader size="sm" />}
              Post
            </Button>
          </div>
        </form>
        <span>or</span>
        <Dialog.Root>
          <Dialog.Trigger>
            <Button highContrast>Upload</Button>
          </Dialog.Trigger>
          <Dialog.Content style={{ maxWidth: 450 }}>
            <Flex gap="3" justify="between" pb="2">
              <Dialog.Title size="5">Upload to Tape</Dialog.Title>
              <DialogClose>
                <IconButton color="gray" variant="ghost">
                  <TimesOutline className="size-3" outlined={false} />
                </IconButton>
              </DialogClose>
            </Flex>
            <div>
              <p>
                You can upload a video to Tape and then post a link to it here.
              </p>
              <div className="mt-4 flex justify-end">
                <Link href="/create">
                  <Button highContrast>Continue to Upload</Button>
                </Link>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Root>
      </fieldset>
    </div>
  )
}

export default New
