import { LENS_PERIPHERY_ABI } from '@abis/LensPeriphery'
import { useMutation } from '@apollo/client'
import IsVerified from '@components/Common/IsVerified'
import { Button } from '@components/UIElements/Button'
import { Input } from '@components/UIElements/Input'
import { TextArea } from '@components/UIElements/TextArea'
import { BROADCAST_MUTATION } from '@gql/queries'
import { CREATE_SET_PROFILE_METADATA_VIA_DISPATHCER } from '@gql/queries/dispatcher'
import { SET_PROFILE_METADATA_TYPED_DATA_MUTATION } from '@gql/queries/typed-data'
import { zodResolver } from '@hookform/resolvers/zod'
import logger from '@lib/logger'
import useAppStore from '@lib/store'
import {
  ERROR_MESSAGE,
  IS_MAINNET,
  LENS_PERIPHERY_ADDRESS,
  LENSTUBE_APP_ID,
  LENSTUBE_URL,
  RELAYER_ENABLED,
  TALLY_VERIFICATION_FORM_URL
} from '@utils/constants'
import { VERIFIED_CHANNELS } from '@utils/data/verified'
import getCoverPicture from '@utils/functions/getCoverPicture'
import { getValueFromKeyInAttributes } from '@utils/functions/getFromAttributes'
import imageCdn from '@utils/functions/imageCdn'
import omitKey from '@utils/functions/omitKey'
import { sanitizeIpfsUrl } from '@utils/functions/sanitizeIpfsUrl'
import trimify from '@utils/functions/trimify'
import uploadToAr from '@utils/functions/uploadToAr'
import uploadMediaToIPFS from '@utils/functions/uploadToIPFS'
import useCopyToClipboard from '@utils/hooks/useCopyToClipboard'
import { Mixpanel, TRACK } from '@utils/track'
import { utils } from 'ethers'
import Link from 'next/link'
import React, { ChangeEvent, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { IoCopyOutline } from 'react-icons/io5'
import {
  CreatePublicSetProfileMetadataUriRequest,
  MediaSet,
  Profile,
  PublicationMetadataDisplayTypes
} from 'src/types'
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
type FormData = z.infer<typeof formSchema>

const BasicInfo = ({ channel }: Props) => {
  const [copy] = useCopyToClipboard()
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
      location: getValueFromKeyInAttributes(channel?.attributes, 'location'),
      twitter: getValueFromKeyInAttributes(channel?.attributes, 'twitter'),
      website: getValueFromKeyInAttributes(channel?.attributes, 'website')
    }
  })

  const onError = (error: any) => {
    toast.error(error?.data?.message ?? error?.message ?? ERROR_MESSAGE)
    setLoading(false)
  }

  const onCompleted = () => {
    toast.success('Channel details submitted')
    Mixpanel.track(TRACK.UPDATED_CHANNEL_INFO)
    setLoading(false)
  }

  const { signTypedDataAsync } = useSignTypedData({
    onError
  })

  const { write: writeMetaData } = useContractWrite({
    addressOrName: LENS_PERIPHERY_ADDRESS,
    contractInterface: LENS_PERIPHERY_ABI,
    functionName: 'setProfileMetadataURIWithSig',
    mode: 'recklesslyUnprepared',
    onError,
    onSuccess: onCompleted
  })

  const [broadcast] = useMutation(BROADCAST_MUTATION, {
    onError,
    onCompleted
  })

  const [createSetProfileMetadataViaDispatcher] = useMutation(
    CREATE_SET_PROFILE_METADATA_VIA_DISPATHCER,
    {
      onError,
      onCompleted
    }
  )

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
          if (!RELAYER_ENABLED) {
            return writeMetaData?.({ recklesslySetUnpreparedArgs: args })
          }
          const { data } = await broadcast({
            variables: { request: { id, signature } }
          })
          if (data?.broadcast?.reason)
            writeMetaData?.({ recklesslySetUnpreparedArgs: args })
        } catch (error) {
          setLoading(false)
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
    if (!data?.createSetProfileMetadataViaDispatcher?.txId) {
      signTypedData(request)
    }
  }

  const onSaveBasicInfo = async (data: FormData) => {
    Mixpanel.track(TRACK.UPDATE_CHANNEL_INFO)
    setLoading(true)
    try {
      const { url } = await uploadToAr({
        version: '1.0.0',
        name: data.displayName || null,
        bio: trimify(data.description),
        cover_picture: coverImage,
        attributes: [
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
    } catch (error) {
      setLoading(false)
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
        <label
          htmlFor="chooseCover"
          className="absolute p-1 px-3 text-sm bg-white rounded-lg cursor-pointer dark:bg-black bottom-2 left-2"
        >
          Change
          <input
            id="chooseCover"
            onClick={() => Mixpanel.track(TRACK.CHANGE_CHANNEL_COVER)}
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
        <div className="flex items-center space-x-3">
          <h6 className="flex items-center space-x-1">
            <span>{channel?.handle}</span>
            <IsVerified id={channel?.id} size="xs" />
          </h6>
          {IS_MAINNET && !VERIFIED_CHANNELS.includes(channel?.id) && (
            <Link
              href={TALLY_VERIFICATION_FORM_URL}
              onClick={() => Mixpanel.track(TRACK.GET_VERIFIED)}
              target="_blank"
              rel="noreferer noreferrer"
              className="text-sm text-transparent bg-clip-text bg-gradient-to-br from-purple-500 to-indigo-600"
            >
              ( Get Verified )
            </Link>
          )}
        </div>
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
      <div className="mt-4">
        <Input
          label="Location"
          placeholder="Metaverse"
          {...register('location')}
          validationError={errors.location?.message}
        />
      </div>
      <div className="flex justify-end mt-4">
        <Button disabled={loading} loading={loading}>
          Save
        </Button>
      </div>
    </form>
  )
}

export default BasicInfo
