import { LENS_PERIPHERY_ABI } from '@abis/LensPeriphery'
import CopyOutline from '@components/Common/Icons/CopyOutline'
import IsVerified from '@components/Common/IsVerified'
import { Button } from '@components/UIElements/Button'
import { Input } from '@components/UIElements/Input'
import { Loader } from '@components/UIElements/Loader'
import { TextArea } from '@components/UIElements/TextArea'
import { zodResolver } from '@hookform/resolvers/zod'
import useAppStore from '@lib/store'
import { utils } from 'ethers'
import type {
  CreatePublicSetProfileMetadataUriRequest,
  MediaSet,
  Profile
} from 'lens'
import {
  PublicationMetadataDisplayTypes,
  useBroadcastMutation,
  useCreateSetProfileMetadataTypedDataMutation,
  useCreateSetProfileMetadataViaDispatcherMutation
} from 'lens'
import Link from 'next/link'
import type { ChangeEvent } from 'react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import type { CustomErrorWithData, IPFSUploadResult } from 'utils'
import {
  Analytics,
  ERROR_MESSAGE,
  IS_MAINNET,
  LENS_PERIPHERY_ADDRESS,
  LENSTUBE_APP_ID,
  LENSTUBE_WEBSITE_URL,
  TALLY_VERIFICATION_FORM_URL,
  TRACK
} from 'utils'
import { VERIFIED_CHANNELS } from 'utils/data/verified'
import getChannelCoverPicture from 'utils/functions/getChannelCoverPicture'
import { getValueFromKeyInAttributes } from 'utils/functions/getFromAttributes'
import imageCdn from 'utils/functions/imageCdn'
import omitKey from 'utils/functions/omitKey'
import sanitizeIpfsUrl from 'utils/functions/sanitizeIpfsUrl'
import trimify from 'utils/functions/trimify'
import uploadToAr from 'utils/functions/uploadToAr'
import uploadToIPFS from 'utils/functions/uploadToIPFS'
import useCopyToClipboard from 'utils/hooks/useCopyToClipboard'
import { v4 as uuidv4 } from 'uuid'
import { useContractWrite, useSignTypedData } from 'wagmi'
import { z } from 'zod'

type Props = {
  channel: Profile & {
    coverPicture: MediaSet
  }
}
const formSchema = z.object({
  displayName: z.union([
    z
      .string()
      .min(4, { message: 'Name should be atleast 5 characters' })
      .max(30, { message: 'Name should not exceed 30 characters' }),
    z.string().max(0)
  ]),
  description: z.union([
    z
      .string()
      .min(5, { message: 'Description should be atleast 5 characters' })
      .max(1000, { message: 'Description should not exceed 1000 characters' }),
    z.string().max(0)
  ]),
  twitter: z.string(),
  location: z.string(),
  website: z.union([
    z
      .string()
      .url({ message: 'Enter valid website URL (eg. https://lenstube.xyz)' }),
    z.string().max(0)
  ])
})
type FormData = z.infer<typeof formSchema> & { coverImage?: string }

const BasicInfo = ({ channel }: Props) => {
  const [copy] = useCopyToClipboard()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [coverImage, setCoverImage] = useState(getChannelCoverPicture(channel))
  const selectedChannel = useAppStore((state) => state.selectedChannel)

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      displayName: channel.name || '',
      description: channel.bio || '',
      location: getValueFromKeyInAttributes(channel?.attributes, 'location'),
      twitter: getValueFromKeyInAttributes(channel?.attributes, 'twitter'),
      website: getValueFromKeyInAttributes(channel?.attributes, 'website')
    }
  })

  const onError = (error: CustomErrorWithData) => {
    toast.error(error?.data?.message ?? error?.message ?? ERROR_MESSAGE)
    setLoading(false)
  }

  const onCompleted = () => {
    toast.success('Channel details submitted')
    Analytics.track(TRACK.UPDATED_CHANNEL_INFO)
    setLoading(false)
  }

  const { signTypedDataAsync } = useSignTypedData({
    onError
  })

  const { write: writeMetaData } = useContractWrite({
    address: LENS_PERIPHERY_ADDRESS,
    abi: LENS_PERIPHERY_ABI,
    functionName: 'setProfileMetadataURIWithSig',
    mode: 'recklesslyUnprepared',
    onError,
    onSuccess: onCompleted
  })

  const [broadcast] = useBroadcastMutation({
    onError,
    onCompleted
  })

  const [createSetProfileMetadataViaDispatcher] =
    useCreateSetProfileMetadataViaDispatcherMutation({
      onError,
      onCompleted
    })

  const [createSetProfileMetadataTypedData] =
    useCreateSetProfileMetadataTypedDataMutation({
      onCompleted: async (data) => {
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
          const { data } = await broadcast({
            variables: { request: { id, signature } }
          })
          if (data?.broadcast?.__typename === 'RelayError')
            writeMetaData?.({ recklesslySetUnpreparedArgs: [args] })
        } catch {
          setLoading(false)
        }
      },
      onError
    })

  const onCopyChannelUrl = async (value: string) => {
    await copy(value)
    toast.success('Copied to clipboard')
  }

  const signTypedData = (request: CreatePublicSetProfileMetadataUriRequest) => {
    createSetProfileMetadataTypedData({
      variables: { request }
    })
  }

  const createViaDispatcher = async (
    request: CreatePublicSetProfileMetadataUriRequest
  ) => {
    const { data } = await createSetProfileMetadataViaDispatcher({
      variables: { request }
    })
    if (
      data?.createSetProfileMetadataViaDispatcher.__typename === 'RelayError'
    ) {
      signTypedData(request)
    }
  }

  const otherAttributes =
    channel?.attributes
      ?.filter(
        (attr) => !['website', 'location', 'twitter', 'app'].includes(attr.key)
      )
      .map(({ traitType, key, value }) => ({ traitType, key, value })) ?? []

  const onSaveBasicInfo = async (data: FormData) => {
    Analytics.track(TRACK.UPDATE_CHANNEL_INFO)
    setLoading(true)
    try {
      const { url } = await uploadToAr({
        version: '1.0.0',
        name: data.displayName || null,
        bio: trimify(data.description),
        cover_picture: data.coverImage ?? coverImage,
        attributes: [
          ...otherAttributes,
          {
            displayType: PublicationMetadataDisplayTypes.String,
            traitType: 'website',
            key: 'website',
            value: data.website
          },
          {
            displayType: PublicationMetadataDisplayTypes.String,
            traitType: 'location',
            key: 'location',
            value: data.location
          },
          {
            displayType: PublicationMetadataDisplayTypes.String,
            traitType: 'twitter',
            key: 'twitter',
            value: data.twitter
          },
          {
            displayType: PublicationMetadataDisplayTypes.String,
            traitType: 'app',
            key: 'app',
            value: LENSTUBE_APP_ID
          }
        ],
        metadata_id: uuidv4()
      })
      const request = {
        profileId: channel?.id,
        metadata: url
      }
      const canUseDispatcher = selectedChannel?.dispatcher?.canUseRelay
      if (!canUseDispatcher) {
        return signTypedData(request)
      }
      createViaDispatcher(request)
    } catch {
      setLoading(false)
    }
  }

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setUploading(true)
      const result: IPFSUploadResult = await uploadToIPFS(e.target.files[0])
      setCoverImage(result.url)
      setUploading(false)
      onSaveBasicInfo({ ...getValues(), coverImage: result.url })
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSaveBasicInfo)}
      className="dark:bg-theme rounded-xl bg-white p-4"
    >
      <div className="relative w-full flex-none">
        {uploading && (
          <div className="absolute z-10 flex h-full w-full items-center justify-center rounded-xl bg-black opacity-40">
            <Loader />
          </div>
        )}
        <img
          src={
            sanitizeIpfsUrl(coverImage) ??
            imageCdn(
              sanitizeIpfsUrl(getChannelCoverPicture(channel)),
              'thumbnail'
            )
          }
          className="h-48 w-full rounded bg-white object-cover object-center dark:bg-gray-900 md:h-56"
          draggable={false}
          alt={`${channel.handle}'s cover`}
        />
        <label
          htmlFor="chooseCover"
          className="dark:bg-theme absolute bottom-2 left-2 cursor-pointer rounded-lg bg-white p-1 px-3 text-sm"
        >
          Change
          <input
            id="chooseCover"
            onClick={() => Analytics.track(TRACK.CHANGE_CHANNEL_COVER)}
            type="file"
            accept=".png, .jpg, .jpeg, .svg"
            className="hidden w-full"
            onChange={handleUpload}
          />
        </label>
      </div>
      <div className="pt-1 text-right text-xs opacity-80">2560 x 1440</div>
      <div className="mb-1 flex items-center">
        <div className="text-[11px] font-semibold uppercase opacity-60">
          Channel
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <h6 className="flex items-center space-x-1">
          <span>{channel?.handle}</span>
          <IsVerified id={channel?.id} size="xs" />
        </h6>
        {IS_MAINNET &&
          !VERIFIED_CHANNELS.includes(channel?.id) &&
          channel.stats.totalFollowers > 500 && (
            <Link
              href={TALLY_VERIFICATION_FORM_URL}
              onClick={() => Analytics.track(TRACK.GET_VERIFIED)}
              target="_blank"
              rel="noreferer noreferrer"
              className="bg-gradient-to-br from-purple-500 to-indigo-600 bg-clip-text text-sm text-transparent"
            >
              ( Get Verified )
            </Link>
          )}
      </div>
      <div className="mt-4">
        <div className="mb-1 flex items-center">
          <div className="text-[11px] font-semibold uppercase opacity-60">
            Channel URL
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span>
            {LENSTUBE_WEBSITE_URL}/{channel.handle}
          </span>
          <button
            className="hover:opacity-60 focus:outline-none"
            onClick={() =>
              onCopyChannelUrl(`${LENSTUBE_WEBSITE_URL}/${channel.handle}`)
            }
            type="button"
          >
            <CopyOutline className="h-4 w-4" />
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
      <div className="mt-4">
        <Input
          label="Location"
          placeholder="Metaverse"
          {...register('location')}
          validationError={errors.location?.message}
        />
      </div>
      <div className="mt-4 flex justify-end">
        <Button loading={loading}>Save</Button>
      </div>
    </form>
  )
}

export default BasicInfo
