import { LENS_PERIPHERY_ABI } from '@abis/LensPeriphery'
import { useMutation } from '@apollo/client'
import IsVerified from '@components/Common/IsVerified'
import { Button } from '@components/UIElements/Button'
import { Input } from '@components/UIElements/Input'
import { TextArea } from '@components/UIElements/TextArea'
import { zodResolver } from '@hookform/resolvers/zod'
import logger from '@lib/logger'
import useAppStore from '@lib/store'
import {
  ERROR_MESSAGE,
  LENS_PERIPHERY_ADDRESS,
  LENSTUBE_APP_ID,
  LENSTUBE_URL,
  RELAYER_ENABLED
} from '@utils/constants'
import getCoverPicture from '@utils/functions/getCoverPicture'
import { getValueFromKeyInAttributes } from '@utils/functions/getFromAttributes'
import imageCdn from '@utils/functions/imageCdn'
import omitKey from '@utils/functions/omitKey'
import { sanitizeIpfsUrl } from '@utils/functions/sanitizeIpfsUrl'
import trimify from '@utils/functions/trimify'
import uploadToAr from '@utils/functions/uploadToAr'
import uploadMediaToIPFS from '@utils/functions/uploadToIPFS'
import { CREATE_SET_PROFILE_METADATA_VIA_DISPATHCER } from '@utils/gql/dispatcher'
import {
  BROADCAST_MUTATION,
  SET_PROFILE_METADATA_TYPED_DATA_MUTATION
} from '@utils/gql/queries'
import useCopyToClipboard from '@utils/hooks/useCopyToClipboard'
import usePendingTxn from '@utils/hooks/usePendingTxn'
import useTxnToast from '@utils/hooks/useTxnToast'
import { utils } from 'ethers'
import React, { ChangeEvent, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { IoCopyOutline } from 'react-icons/io5'
import { Attribute, MediaSet, Profile } from 'src/types'
import { IPFSUploadResult } from 'src/types/local'
import { v4 as uuidv4 } from 'uuid'
import { useContractWrite, useSignTypedData } from 'wagmi'
import { z } from 'zod'

type Props = {
  channel: Profile & {
    coverPicture: MediaSet
  }
}
const formSchema = z.object({
  displayName: z
    .string()
    .min(4, { message: 'Name should be atleast 5 characters' })
    .max(30, { message: 'Name should not exceed 30 characters' })
    .optional(),
  description: z
    .string()
    .min(5, { message: 'Description should be atleast 5 characters' })
    .max(1000, { message: 'Description should not exceed 1000 characters' }),
  twitter: z.string(),
  website: z
    .string()
    .url({ message: 'Enter valid website URL (eg. https://lenstube.xyz)' })
})
type FormData = z.infer<typeof formSchema>

const BasicInfo = ({ channel }: Props) => {
  const [, copy] = useCopyToClipboard()
  const { showToast } = useTxnToast()
  const [loading, setLoading] = useState(false)
  const [coverImage, setCoverImage] = useState(getCoverPicture(channel) || '')
  const selectedChannel = useAppStore((state) => state.selectedChannel)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      displayName: channel.name || '',
      description: channel.bio || '',
      twitter: getValueFromKeyInAttributes(channel?.attributes, 'twitter'),
      website: getValueFromKeyInAttributes(channel?.attributes, 'website')
    }
  })

  const onError = (error: any) => {
    toast.error(error?.data?.message ?? error?.message ?? ERROR_MESSAGE)
    setLoading(false)
  }

  const onCompleted = (hash: string) => {
    showToast(hash)
  }

  const { signTypedDataAsync } = useSignTypedData({
    onError
  })

  const { write: writeMetaData, data: writtenData } = useContractWrite({
    addressOrName: LENS_PERIPHERY_ADDRESS,
    contractInterface: LENS_PERIPHERY_ABI,
    functionName: 'setProfileMetadataURIWithSig',
    mode: 'recklesslyUnprepared',
    onError,
    onSuccess: (data) => onCompleted(data.hash)
  })

  const [broadcast, { data: broadcastData }] = useMutation(BROADCAST_MUTATION, {
    onError,
    onCompleted: (data) => onCompleted(data.txHash)
  })

  const [createSetProfileMetadataViaDispatcher, { data: dispatcherData }] =
    useMutation(CREATE_SET_PROFILE_METADATA_VIA_DISPATHCER, {
      onError,
      onCompleted: (data) =>
        onCompleted(data.createSetProfileMetadataViaDispatcher.txHash)
    })

  const { indexed } = usePendingTxn({
    txHash: writtenData?.hash,
    txId:
      dispatcherData?.createSetProfileMetadataViaDispatcher?.txId ??
      broadcastData?.broadcast?.txId
  })

  useEffect(() => {
    if (indexed) {
      setLoading(false)
      toast.success('Channel info updated')
    }
  }, [indexed])

  const [createSetProfileMetadataTypedData] = useMutation(
    SET_PROFILE_METADATA_TYPED_DATA_MUTATION,
    {
      async onCompleted(data) {
        const { typedData, id } = data.createSetProfileMetadataTypedData
        try {
          const signature = await signTypedDataAsync({
            domain: omitKey(typedData?.domain, '__typename'),
            types: omitKey(typedData?.types, '__typename'),
            value: omitKey(typedData?.value, '__typename')
          })
          const { profileId, metadata } = typedData?.value
          const { v, r, s } = utils.splitSignature(signature)
          const args = {
            user: channel?.ownedBy,
            profileId,
            metadata,
            sig: { v, r, s, deadline: typedData.value.deadline }
          }
          if (RELAYER_ENABLED) {
            const { data } = await broadcast({
              variables: { request: { id, signature } }
            })
            if (data?.broadcast?.reason)
              writeMetaData?.({ recklesslySetUnpreparedArgs: args })
          } else {
            writeMetaData?.({ recklesslySetUnpreparedArgs: args })
          }
        } catch (error) {
          logger.error('[Error Set Basic info Typed Data]', error)
        }
      },
      onError
    }
  )

  const onCopyChannelUrl = async (value: string) => {
    await copy(value)
    toast.success('Copied to clipboard')
  }

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const result: IPFSUploadResult = await uploadMediaToIPFS(
        e.target.files[0]
      )
      setCoverImage(result.url)
    }
  }

  const onSaveBasicInfo = async (data: FormData) => {
    setLoading(true)
    try {
      const { url } = await uploadToAr({
        name: data.displayName || '',
        bio: trimify(data.description),
        cover_picture: coverImage,
        attributes: [
          {
            displayType: 'string',
            traitType: 'website',
            key: 'website',
            value: data.website
          },
          {
            displayType: 'string',
            traitType: 'location',
            key: 'location',
            value:
              getValueFromKeyInAttributes(
                channel.attributes as Attribute[],
                'location'
              ) || ''
          },
          {
            displayType: 'string',
            traitType: 'twitter',
            key: 'twitter',
            value: data.twitter
          },
          {
            displayType: 'string',
            traitType: 'app',
            key: 'app',
            value: LENSTUBE_APP_ID
          }
        ],
        version: '1.0.0',
        metadata_id: uuidv4(),
        previousMetadata: channel?.metadata,
        createdOn: new Date(),
        appId: LENSTUBE_APP_ID
      })
      const request = {
        profileId: channel?.id,
        metadata: url
      }
      if (selectedChannel?.dispatcher?.canUseRelay) {
        createSetProfileMetadataViaDispatcher({ variables: { request } })
      } else {
        createSetProfileMetadataTypedData({
          variables: { request }
        })
      }
    } catch (error) {
      logger.error('[Error Store & Save Basic info]', error)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSaveBasicInfo)}
      className="p-4 bg-white rounded-lg dark:bg-black"
    >
      <div className="relative flex-none w-full">
        <img
          src={
            sanitizeIpfsUrl(coverImage) ??
            imageCdn(
              sanitizeIpfsUrl(channel?.coverPicture?.original?.url),
              'thumbnail'
            )
          }
          className="object-cover object-center w-full h-48 bg-white rounded-xl md:h-56 dark:bg-gray-900"
          draggable={false}
          alt="Cover Image"
        />
        <label className="absolute p-1 px-3 text-sm bg-white rounded-md cursor-pointer dark:bg-black top-2 right-2">
          Change
          <input
            type="file"
            accept=".png, .jpg, .jpeg, .svg"
            className="hidden w-full"
            onChange={handleUpload}
          />
        </label>
      </div>
      <div className="mt-4">
        <div className="flex items-center mb-1">
          <div className="text-[11px] font-semibold uppercase opacity-60">
            Channel
          </div>
        </div>
        <h6 className="flex items-center space-x-1">
          <span>{channel?.handle}</span>
          <IsVerified id={channel?.id} size="xs" />
        </h6>
      </div>
      <div className="mt-4">
        <div className="flex items-center mb-1">
          <div className="text-[11px] font-semibold uppercase opacity-60">
            Channel URL
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span>
            {LENSTUBE_URL}/{channel.handle}
          </span>
          <button
            className="hover:opacity-60 focus:outline-none"
            onClick={() =>
              onCopyChannelUrl(`${LENSTUBE_URL}/${channel.handle}`)
            }
            type="button"
          >
            <IoCopyOutline />
          </button>
        </div>
      </div>
      <div className="mt-6">
        <Input
          label="Display Name"
          type="text"
          placeholder="T Series"
          {...register('displayName')}
          validationError={errors.displayName?.message}
        />
      </div>
      <div className="mt-4">
        <TextArea
          label="Channel Description"
          placeholder="More about your channel"
          rows={4}
          validationError={errors.description?.message}
          {...register('description')}
        />
      </div>
      <div className="mt-4">
        <Input
          label="Twitter"
          placeholder="johndoe"
          {...register('twitter')}
          validationError={errors.twitter?.message}
          prefix="https://twitter.com/"
        />
      </div>
      <div className="mt-4">
        <Input
          label="Website"
          placeholder="https://johndoe.xyz"
          {...register('website')}
          validationError={errors.website?.message}
        />
      </div>
      <div className="flex justify-end mt-4">
        <Button disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
      </div>
    </form>
  )
}

export default BasicInfo
