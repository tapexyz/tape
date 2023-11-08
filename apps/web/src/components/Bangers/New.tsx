import { Input } from '@components/UIElements/Input'
import { zodResolver } from '@hookform/resolvers/zod'
import useHandleWrongNetwork from '@hooks/useHandleWrongNetwork'
import type { MetadataAttribute } from '@lens-protocol/metadata'
import { link, MetadataAttributeType } from '@lens-protocol/metadata'
import useNonceStore from '@lib/store/nonce'
import useProfileStore from '@lib/store/profile'
import { Button } from '@radix-ui/themes'
import { LENSHUB_PROXY_ABI } from '@tape.xyz/abis'
import { getUserLocale } from '@tape.xyz/browser'
import {
  ERROR_MESSAGE,
  FALLBACK_COVER_URL,
  LENSHUB_PROXY_ADDRESS,
  OG_IMAGE,
  REQUESTING_SIGNATURE_MESSAGE,
  TAPE_APP_ID,
  TAPE_WEBSITE_URL,
  USDC_TOKEN_ADDRESS
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
  CreateOnchainPostEip712TypedData,
  OnchainPostRequest
} from '@tape.xyz/lens'
import {
  useBroadcastOnchainMutation,
  useCreateOnchainPostTypedDataMutation,
  usePostOnchainMutation
} from '@tape.xyz/lens'
import type { CustomErrorWithData } from '@tape.xyz/lens/custom-types'
import { Loader } from '@tape.xyz/ui'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { v4 as uuidv4 } from 'uuid'
import { useContractWrite, useSignTypedData } from 'wagmi'
import type { z } from 'zod'
import { object, string } from 'zod'

const formSchema = object({
  link: string().url({ message: 'Invalid URL' })
})
type FormData = z.infer<typeof formSchema>

const New = () => {
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
    toast.success('Posted successfully!')
    Tower.track(EVENTS.PUBLICATION.NEW_POST, {
      type: 'banger',
      publication_state: canUseLensManager ? 'MOMOKA' : 'ON_CHAIN',
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
      setLoading(false)
      setLensHubOnchainSigNonce(lensHubOnchainSigNonce + 1)
    },
    onError: (error) => {
      onError(error)
      setLensHubOnchainSigNonce(lensHubOnchainSigNonce - 1)
    }
  })

  const getSignatureFromTypedData = async (
    data: CreateMomokaPostEip712TypedData | CreateOnchainPostEip712TypedData
  ) => {
    toast.loading(REQUESTING_SIGNATURE_MESSAGE)
    const signature = await signTypedDataAsync(getSignature(data))
    return signature
  }

  const [broadcastOnchain] = useBroadcastOnchainMutation({
    onCompleted: ({ broadcastOnchain }) => {
      onCompleted(broadcastOnchain.__typename)
    }
  })

  const [createOnchainPostTypedData] = useCreateOnchainPostTypedDataMutation({
    onCompleted: async ({ createOnchainPostTypedData }) => {
      const { typedData, id } = createOnchainPostTypedData
      try {
        if (canBroadcast) {
          const signature = await getSignatureFromTypedData(typedData)
          const { data } = await broadcastOnchain({
            variables: { request: { id, signature } }
          })
          if (data?.broadcastOnchain?.__typename === 'RelayError') {
            return write({ args: [typedData.value] })
          }
          return
        }
        return write({ args: [typedData.value] })
      } catch {}
    },
    onError
  })

  const [postOnchain] = usePostOnchainMutation({
    onError,
    onCompleted: ({ postOnchain }) => {
      if (postOnchain.__typename === 'RelaySuccess') {
        onCompleted(postOnchain.__typename)
      }
    }
  })

  const onSubmit = async () => {
    if (handleWrongNetwork()) {
      return
    }
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

    const request: OnchainPostRequest = {
      contentURI: metadataUri,
      openActionModules: [
        {
          collectOpenAction: {
            simpleCollectOpenAction: {
              followerOnly: false,
              amount: { value: '1', currency: USDC_TOKEN_ADDRESS },
              referralFee: 10
            }
          }
        }
      ]
    }
    if (canUseLensManager) {
      return await postOnchain({
        variables: { request }
      })
    }

    return await createOnchainPostTypedData({
      variables: {
        options: { overrideSigNonce: lensHubOnchainSigNonce },
        request
      }
    })
  }

  return (
    <div
      style={{
        backgroundImage: `url("${imageCdn(FALLBACK_COVER_URL)}")`
      }}
      className="relative h-44 w-full bg-gray-300 bg-cover bg-center bg-no-repeat dark:bg-gray-700 md:h-[20vh]"
    >
      <fieldset
        disabled={!activeProfile || loading}
        className="container mx-auto flex h-full max-w-screen-sm flex-col justify-center px-4 md:px-0"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex space-x-2">
            <Input
              placeholder="Paste a link to a banger"
              size="3"
              autoComplete="off"
              className="bg-white dark:bg-black"
              showErrorLabel={false}
              validationError={errors.link?.message}
              {...register('link')}
            />
            <Button size="3" disabled={loading} highContrast>
              {loading && <Loader size="sm" />}
              Post
            </Button>
          </div>
        </form>
      </fieldset>
    </div>
  )
}

export default New
