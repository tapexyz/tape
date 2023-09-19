import { LENSHUB_PROXY_ABI } from '@abis/LensHubProxy'
import Badge from '@components/Common/Badge'
import CopyOutline from '@components/Common/Icons/CopyOutline'
import { Button } from '@components/UIElements/Button'
import EmojiPicker from '@components/UIElements/EmojiPicker'
import { Input } from '@components/UIElements/Input'
import { TextArea } from '@components/UIElements/TextArea'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Analytics,
  TRACK,
  uploadToIPFS,
  useCopyToClipboard
} from '@lenstube/browser'
import {
  ERROR_MESSAGE,
  LENSHUB_PROXY_ADDRESS,
  LENSTUBE_APP_ID,
  LENSTUBE_WEBSITE_URL,
  REQUESTING_SIGNATURE_MESSAGE
} from '@lenstube/constants'
import {
  getChannelCoverPicture,
  getSignature,
  getValueFromKeyInAttributes,
  imageCdn,
  sanitizeDStorageUrl,
  trimify,
  trimLensHandle,
  uploadToAr
} from '@lenstube/generic'
import type {
  ImageSet,
  OnchainSetProfileMetadataRequest,
  Profile
} from '@lenstube/lens'
import {
  useBroadcastOnchainMutation,
  useCreateOnchainSetProfileMetadataTypedDataMutation
} from '@lenstube/lens'
import type {
  CustomErrorWithData,
  IPFSUploadResult
} from '@lenstube/lens/custom-types'
import { Loader } from '@lenstube/ui'
import useChannelStore from '@lib/store/channel'
import { t, Trans } from '@lingui/macro'
import type { ChangeEvent } from 'react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { v4 as uuidv4 } from 'uuid'
import { useContractWrite, useSignTypedData } from 'wagmi'
import type { z } from 'zod'
import { object, string, union } from 'zod'

type Props = {
  channel: Profile & {
    coverPicture: ImageSet
  }
}
const formSchema = object({
  displayName: union([
    string()
      .min(4, { message: 'Name should be atleast 5 characters' })
      .max(30, { message: 'Name should not exceed 30 characters' }),
    string().max(0)
  ]),
  description: union([
    string()
      .min(5, { message: 'Description should be atleast 5 characters' })
      .max(1000, { message: 'Description should not exceed 1000 characters' }),
    string().max(0)
  ]),
  x: string(),
  youtube: string(),
  location: string(),
  website: union([
    string().url({
      message: 'Enter valid website URL (eg. https://lenstube.xyz)'
    }),
    string().max(0)
  ])
})
type FormData = z.infer<typeof formSchema> & { coverImage?: string }

const BasicInfo = ({ channel }: Props) => {
  const [copy] = useCopyToClipboard()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [coverImage, setCoverImage] = useState(getChannelCoverPicture(channel))

  const activeChannel = useChannelStore((state) => state.activeChannel)
  // Dispatcher
  const canUseRelay = activeChannel?.lensManager && activeChannel?.sponsor

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      displayName: channel.metadata?.displayName || '',
      description: channel.metadata?.bio || '',
      location: getValueFromKeyInAttributes(
        channel.metadata?.attributes,
        'location'
      ),
      x: getValueFromKeyInAttributes(channel.metadata?.attributes, 'x'),
      youtube: getValueFromKeyInAttributes(
        channel.metadata?.attributes,
        'youtube'
      ),
      website: getValueFromKeyInAttributes(
        channel.metadata?.attributes,
        'website'
      )
    }
  })

  const onError = (error: CustomErrorWithData) => {
    toast.error(error?.data?.message ?? error?.message ?? ERROR_MESSAGE)
    setLoading(false)
  }

  const onCompleted = (__typename?: 'RelayError' | 'RelaySuccess') => {
    if (__typename === 'RelayError') {
      return
    }
    setLoading(false)
    toast.success('Channel details submitted')
    Analytics.track(TRACK.CHANNEL.UPDATE)
  }

  const { signTypedDataAsync } = useSignTypedData({
    onError
  })

  const { write } = useContractWrite({
    address: LENSHUB_PROXY_ADDRESS,
    abi: LENSHUB_PROXY_ABI,
    functionName: 'setProfileMetadataURI',
    onError,
    onSuccess: () => onCompleted()
  })

  const [broadcast] = useBroadcastOnchainMutation({
    onError,
    onCompleted: ({ broadcastOnchain }) =>
      onCompleted(broadcastOnchain.__typename)
  })

  const [createSetProfileMetadataTypedData] =
    useCreateOnchainSetProfileMetadataTypedDataMutation({
      onCompleted: async ({ createOnchainSetProfileMetadataTypedData }) => {
        const { typedData, id } = createOnchainSetProfileMetadataTypedData
        try {
          toast.loading(REQUESTING_SIGNATURE_MESSAGE)
          const signature = await signTypedDataAsync(getSignature(typedData))
          const { data } = await broadcast({
            variables: { request: { id, signature } }
          })
          if (data?.broadcastOnchain?.__typename === 'RelayError') {
            const { profileId, metadataURI } = typedData.value
            return write?.({ args: [profileId, metadataURI] })
          }
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

  const otherAttributes =
    channel.metadata?.attributes
      ?.filter(
        (attr) =>
          !['website', 'location', 'x', 'youtube', 'app'].includes(attr.key)
      )
      .map(({ type, key, value }) => ({ type, key, value })) ?? []

  const onSaveBasicInfo = async (data: FormData) => {
    setLoading(true)
    try {
      const metadataUri = await uploadToAr({
        version: '1.0.0',
        name: data.displayName || null,
        bio: trimify(data.description),
        cover_picture: data.coverImage ?? coverImage,
        attributes: [
          ...otherAttributes,
          {
            type: 'website',
            key: 'website',
            value: data.website
          },
          {
            type: 'location',
            key: 'location',
            value: data.location
          },
          {
            type: 'x',
            key: 'x',
            value: data.x
          },
          {
            type: 'youtube',
            key: 'youtube',
            value: data.youtube
          },
          {
            type: 'app',
            key: 'app',
            value: LENSTUBE_APP_ID
          }
        ],
        metadata_id: uuidv4()
      })
      const request: OnchainSetProfileMetadataRequest = {
        metadataURI: metadataUri
      }
      if (canUseRelay) {
        await createSetProfileMetadataTypedData({
          variables: { request }
        })
      }
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
          <div className="absolute z-10 flex h-full w-full items-center justify-center rounded bg-black opacity-40">
            <Loader />
          </div>
        )}
        <img
          src={
            sanitizeDStorageUrl(coverImage) ??
            imageCdn(
              sanitizeDStorageUrl(getChannelCoverPicture(channel)),
              'THUMBNAIL'
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
          <Trans>Change</Trans>
          <input
            id="chooseCover"
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
          <Trans>Channel</Trans>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <h6 className="flex items-center space-x-1">
          <span>{channel?.handle}</span>
          <Badge id={channel?.id} size="xs" />
        </h6>
      </div>
      <div className="mt-4">
        <div className="mb-1 flex items-center">
          <div className="text-[11px] font-semibold uppercase opacity-60">
            <Trans>Channel URL</Trans>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span>
            {LENSTUBE_WEBSITE_URL}/channel/{trimLensHandle(channel.handle)}
          </span>
          <button
            className="hover:opacity-60 focus:outline-none"
            onClick={() =>
              onCopyChannelUrl(
                `${LENSTUBE_WEBSITE_URL}/channel/${trimLensHandle(
                  channel.handle
                )}`
              )
            }
            type="button"
          >
            <CopyOutline className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="mt-6">
        <Input
          label={t`Display Name`}
          type="text"
          placeholder="T Series"
          {...register('displayName')}
          validationError={errors.displayName?.message}
        />
      </div>
      <div className="relative mt-4">
        <TextArea
          label={t`Channel Description`}
          placeholder={t`More about your channel`}
          rows={4}
          validationError={errors.description?.message}
          {...register('description')}
        />
        <div className="absolute bottom-2 right-2">
          <EmojiPicker
            onEmojiSelect={(emoji) =>
              setValue('description', `${getValues('description')}${emoji}`)
            }
          />
        </div>
      </div>
      <div className="mt-4">
        <Input
          label="Youtube"
          placeholder="channel"
          {...register('youtube')}
          validationError={errors.x?.message}
          prefix="https://youtube.com/"
        />
      </div>
      <div className="mt-4">
        <Input
          label="X.com"
          placeholder="profile"
          {...register('x')}
          validationError={errors.x?.message}
          prefix="https://x.com/"
        />
      </div>
      <div className="mt-4">
        <Input
          label={t`Website`}
          placeholder="https://johndoe.xyz"
          {...register('website')}
          validationError={errors.website?.message}
        />
      </div>
      <div className="mt-4">
        <Input
          label={t`Location`}
          placeholder="Metaverse"
          {...register('location')}
          validationError={errors.location?.message}
        />
      </div>
      <div className="mt-4 flex justify-end">
        <Button loading={loading}>
          <Trans>Save</Trans>
        </Button>
      </div>
    </form>
  )
}

export default BasicInfo
