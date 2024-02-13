import { zodResolver } from '@hookform/resolvers/zod'
import useHandleWrongNetwork from '@hooks/useHandleWrongNetwork'
import type { MetadataAttribute } from '@lens-protocol/metadata'
import { link, MetadataAttributeType } from '@lens-protocol/metadata'
import useProfileStore from '@lib/store/idb/profile'
import useNonceStore from '@lib/store/nonce'
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
import type {
  CreateMomokaPostEip712TypedData,
  CreateOnchainPostEip712TypedData
} from '@tape.xyz/lens'
import {
  useBroadcastOnMomokaMutation,
  useCreateMomokaPostTypedDataMutation,
  usePostOnMomokaMutation
} from '@tape.xyz/lens'
import type { CustomErrorWithData } from '@tape.xyz/lens/custom-types'
import { Button, Input, Modal } from '@tape.xyz/ui'
import Link from 'next/link'
import type { FC } from 'react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { v4 as uuidv4 } from 'uuid'
import { useSignTypedData, useWriteContract } from 'wagmi'
import type { z } from 'zod'
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
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(formSchema)
  })
  const [loading, setLoading] = useState(false)
  const [showNewUploadModal, setShowNewUploadModal] = useState(false)
  const activeProfile = useProfileStore((state) => state.activeProfile)
  const handleWrongNetwork = useHandleWrongNetwork()
  const { canUseLensManager, canBroadcast } =
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
    __typename?: 'RelayError' | 'RelaySuccess' | 'CreateMomokaPublicationResult'
  ) => {
    if (__typename === 'RelayError') {
      return
    }
    setLoading(false)
    reset()
    refetch()
    toast.success('Posted successfully!')
    Tower.track(EVENTS.PUBLICATION.NEW_POST, {
      type: 'banger',
      publication_state: canUseLensManager ? 'MOMOKA' : 'ON_CHAIN',
      user_id: activeProfile?.id
    })
    if (!canUseLensManager) {
      location.reload()
    }
  }

  const { signTypedDataAsync } = useSignTypedData({
    mutation: { onError }
  })

  const getSignatureFromTypedData = async (
    data: CreateMomokaPostEip712TypedData | CreateOnchainPostEip712TypedData
  ) => {
    toast.loading(REQUESTING_SIGNATURE_MESSAGE)
    const signature = await signTypedDataAsync(getSignature(data))
    return signature
  }

  const { writeContractAsync } = useWriteContract({
    mutation: {
      onSuccess: () => {
        setLoading(false)
        setLensHubOnchainSigNonce(lensHubOnchainSigNonce + 1)
        onCompleted()
      },
      onError: (error) => {
        onError(error)
        setLensHubOnchainSigNonce(lensHubOnchainSigNonce - 1)
      }
    }
  })

  const [broadcastOnMomoka] = useBroadcastOnMomokaMutation({
    onCompleted: ({ broadcastOnMomoka }) => {
      if (broadcastOnMomoka.__typename === 'CreateMomokaPublicationResult') {
        onCompleted(broadcastOnMomoka.__typename)
      }
    }
  })

  const write = async ({ args }: { args: any[] }) => {
    return await writeContractAsync({
      address: LENSHUB_PROXY_ADDRESS,
      abi: LENSHUB_PROXY_ABI,
      functionName: 'post',
      args
    })
  }

  const [createMomokaPostTypedData] = useCreateMomokaPostTypedDataMutation({
    onCompleted: async ({ createMomokaPostTypedData }) => {
      const { typedData, id } = createMomokaPostTypedData
      try {
        if (canBroadcast) {
          const signature = await getSignatureFromTypedData(typedData)
          const { data } = await broadcastOnMomoka({
            variables: { request: { id, signature } }
          })
          if (data?.broadcastOnMomoka?.__typename === 'RelayError') {
            return await write({ args: [typedData.value] })
          }
          return
        }
        return await write({ args: [typedData.value] })
      } catch {}
    },
    onError
  })

  const [postOnMomoka] = usePostOnMomokaMutation({
    onError,
    onCompleted: ({ postOnMomoka }) => {
      if (postOnMomoka.__typename === 'CreateMomokaPublicationResult') {
        onCompleted(postOnMomoka.__typename)
      }
    }
  })

  const onSubmit = async () => {
    if (!activeProfile) {
      return toast.error(SIGN_IN_REQUIRED)
    }
    await handleWrongNetwork()

    setLoading(true)
    const linkText = trimify(getValues('link'))
    const attributes: MetadataAttribute[] = [
      {
        type: MetadataAttributeType.STRING,
        key: 'publication',
        value: 'banger'
      }
    ]
    const linkMetadata = link({
      sharingLink: linkText,
      appId: TAPE_APP_ID,
      id: uuidv4(),
      content: `Only Bangers by Tape 📼 \n${TAPE_WEBSITE_URL}/bangers`,
      locale: getUserLocale(),
      tags: ['banger'],
      marketplace: {
        name: `Banger by @${getProfile(activeProfile)?.slug}`,
        attributes,
        description: linkText,
        image: OG_IMAGE,
        external_url: `${TAPE_WEBSITE_URL}/bangers`
      },
      attributes
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
      style={{
        backgroundImage: `url("${imageCdn(FALLBACK_COVER_URL)}")`
      }}
      className="relative h-44 w-full bg-gray-300 bg-cover bg-center bg-no-repeat md:h-[30vh] dark:bg-gray-700"
    >
      <fieldset
        disabled={loading}
        className="container mx-auto flex h-full max-w-screen-sm flex-col items-center justify-center space-y-4 px-4 md:px-0"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <div className="flex items-center space-x-2">
            <Input
              title="Tape/YouTube/Vimeo links supported"
              placeholder="Paste a link to a banger"
              autoComplete="off"
              className="bg-white dark:bg-black"
              error={errors.link?.message}
              showError={false}
              {...register('link')}
            />
            <Button disabled={loading} loading={loading}>
              Post
            </Button>
          </div>
        </form>
        <span>or</span>
        <Button onClick={() => setShowNewUploadModal(true)}>Upload</Button>
        <Modal
          size="sm"
          show={showNewUploadModal}
          setShow={setShowNewUploadModal}
          title="Upload to Tape"
        >
          <div>
            <p>
              You can upload a video to Tape and then post a link to it here.
            </p>
            <div className="mt-4 flex justify-end">
              <Link href="/create">
                <Button>Continue to Upload</Button>
              </Link>
            </div>
          </div>
        </Modal>
      </fieldset>
    </div>
  )
}

export default New
