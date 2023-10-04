import Badge from '@components/Common/Badge'
import AddImageOutline from '@components/Common/Icons/AddImageOutline'
import CopyOutline from '@components/Common/Icons/CopyOutline'
import EmojiPicker from '@components/UIElements/EmojiPicker'
import { Input } from '@components/UIElements/Input'
import { TextArea } from '@components/UIElements/TextArea'
import Tooltip from '@components/UIElements/Tooltip'
import { zodResolver } from '@hookform/resolvers/zod'
import useHandleWrongNetwork from '@hooks/useHandleWrongNetwork'
import type { MetadataAttribute, ProfileOptions } from '@lens-protocol/metadata'
import { MetadataAttributeType, profile } from '@lens-protocol/metadata'
import { LENSHUB_PROXY_ABI } from '@lenstube/abis'
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
  getProfilePicture,
  getSignature,
  getValueFromKeyInAttributes,
  imageCdn,
  sanitizeDStorageUrl,
  trimify,
  trimLensHandle,
  uploadToAr
} from '@lenstube/generic'
import type { OnchainSetProfileMetadataRequest, Profile } from '@lenstube/lens'
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
import { Button, Card, Flex, IconButton } from '@radix-ui/themes'
import clsx from 'clsx'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { v4 as uuidv4 } from 'uuid'
import { useContractWrite, useSignTypedData } from 'wagmi'
import type { z } from 'zod'
import { object, string, union } from 'zod'

type Props = {
  channel: Profile
}

const formSchema = object({
  displayName: string().max(30, {
    message: 'Name should not exceed 30 characters'
  }),
  description: string().max(500, {
    message: 'Description should not exceed 500 characters'
  }),
  x: string(),
  youtube: string(),
  location: string(),
  spotify: string(),
  website: union([
    string().url({
      message: 'Invalid website URL'
    }),
    string().max(0)
  ])
})
type FormData = z.infer<typeof formSchema> & { coverImage?: string }

const BasicInfo = ({ channel }: Props) => {
  const [copy] = useCopyToClipboard()
  const [loading, setLoading] = useState(false)
  const [coverImage, setCoverImage] = useState(getChannelCoverPicture(channel))
  const [selectedPfp, setSelectedPfp] = useState('')
  const [uploading, setUploading] = useState({ pfp: false, cover: false })
  const handleWrongNetwork = useHandleWrongNetwork()

  const activeChannel = useChannelStore((state) => state.activeChannel)
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
      displayName: channel.metadata?.displayName ?? '',
      description: channel.metadata?.bio ?? '',
      location: getValueFromKeyInAttributes(
        channel.metadata?.attributes,
        'location'
      ),
      x: getValueFromKeyInAttributes(channel.metadata?.attributes, 'x'),
      youtube: getValueFromKeyInAttributes(
        channel.metadata?.attributes,
        'youtube'
      ),
      spotify: getValueFromKeyInAttributes(
        channel.metadata?.attributes,
        'spotify'
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
    toast.success('Profile updated')
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

  const otherAttributes =
    channel.metadata?.attributes
      ?.filter(
        (attr) =>
          !['website', 'location', 'x', 'youtube', 'spotify', 'app'].includes(
            attr.key
          )
      )
      .map(({ key, value }) => ({ key, value })) ?? []

  const onSaveBasicInfo = async (data: FormData) => {
    if (handleWrongNetwork()) {
      return
    }
    setLoading(true)
    try {
      const profileMetadata: ProfileOptions = {
        appId: LENSTUBE_APP_ID,
        coverPicture: data.coverImage ?? coverImage,
        id: uuidv4(),
        attributes: [
          ...(otherAttributes as MetadataAttribute[]),
          {
            type: MetadataAttributeType.STRING,
            key: 'website',
            value: data.website
          },
          {
            type: MetadataAttributeType.STRING,
            key: 'location',
            value: data.location
          },
          {
            type: MetadataAttributeType.STRING,
            key: 'x',
            value: data.x
          },
          {
            type: MetadataAttributeType.STRING,
            key: 'youtube',
            value: data.youtube
          },
          {
            type: MetadataAttributeType.STRING,
            key: 'spotify',
            value: data.spotify
          },
          {
            type: MetadataAttributeType.STRING,
            key: 'app',
            value: LENSTUBE_APP_ID
          }
        ]
      }
      profileMetadata.attributes = profileMetadata.attributes?.filter((m) =>
        Boolean(trimify(m.value))
      )
      if (Boolean(trimify(data.description))) {
        profileMetadata.bio = trimify(data.description)
      }
      if (Boolean(selectedPfp)) {
        profileMetadata.picture = trimify(selectedPfp)
      }
      if (Boolean(trimify(data.displayName))) {
        profileMetadata.name = trimify(data.displayName)
      }
      if (
        Boolean(
          trimify(getProfilePicture(activeChannel as Profile, 'AVATAR', false))
        )
      ) {
        profileMetadata.picture = getProfilePicture(
          activeChannel as Profile,
          'AVATAR',
          false
        )
      }
      const metadata = profile(profileMetadata)
      const metadataUri = await uploadToAr(metadata)
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

  return (
    <Card size="3">
      <form onSubmit={handleSubmit(onSaveBasicInfo)}>
        <div className="relative w-full flex-none">
          {uploading.cover && (
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
            className="h-48 w-full rounded-md bg-white object-cover object-center dark:bg-gray-900 md:h-56"
            draggable={false}
            alt={`${channel.handle}'s cover`}
          />
          <div className="absolute bottom-2 right-2 cursor-pointer rounded-md text-sm dark:bg-black">
            <Button
              highContrast
              type="button"
              variant="surface"
              className="!px-0"
            >
              <label htmlFor="chooseCover" className="p-3">
                <Trans>Choose</Trans>
                <input
                  id="chooseCover"
                  type="file"
                  accept=".png, .jpg, .jpeg, .svg"
                  className="hidden w-full"
                  onChange={async (e) => {
                    if (e.target.files?.length) {
                      setUploading({ cover: true, pfp: false })
                      const result: IPFSUploadResult = await uploadToIPFS(
                        e.target.files[0]
                      )
                      setCoverImage(result.url)
                      setUploading({ cover: false, pfp: false })
                    }
                  }}
                />
              </label>
            </Button>
          </div>
        </div>
        <Flex align="center" mt="5" gap="5" wrap="wrap">
          <div className="group relative flex-none overflow-hidden rounded-full">
            <img
              src={
                selectedPfp
                  ? sanitizeDStorageUrl(selectedPfp)
                  : getProfilePicture(channel, 'AVATAR_LG')
              }
              className="h-32 w-32 rounded-full border-2 object-cover"
              draggable={false}
              alt={selectedPfp ? activeChannel?.handle : channel.handle}
            />
            <label
              htmlFor="choosePfp"
              className={clsx(
                'invisible absolute top-0 grid h-32 w-32 cursor-pointer place-items-center rounded-full bg-white bg-opacity-70 backdrop-blur-lg group-hover:visible dark:bg-black',
                { '!visible': uploading.pfp }
              )}
            >
              {uploading.pfp ? (
                <Loader />
              ) : (
                <AddImageOutline className="h-5 w-5" />
              )}
              <input
                id="choosePfp"
                type="file"
                accept=".png, .jpg, .jpeg, .svg, .gif"
                className="hidden w-full"
                onChange={async (e) => {
                  if (e.target.files?.length) {
                    setUploading({ cover: false, pfp: true })
                    const { url }: IPFSUploadResult = await uploadToIPFS(
                      e.target.files[0]
                    )
                    setSelectedPfp(url)
                    setUploading({ cover: false, pfp: false })
                  }
                }}
              />
            </label>
          </div>
          <div>
            <div className="mb-1 flex items-center">
              <div className="text-[11px] font-semibold uppercase opacity-60">
                <Trans>Profile</Trans>
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
                  <Trans>Profile URL</Trans>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span>
                  {LENSTUBE_WEBSITE_URL}/channel/
                  {trimLensHandle(channel.handle)}
                </span>
                <Tooltip content="Copy" placement="top">
                  <IconButton
                    className="hover:opacity-60 focus:outline-none"
                    onClick={async () =>
                      await copy(
                        `${LENSTUBE_WEBSITE_URL}/channel/${trimLensHandle(
                          channel.handle
                        )}`
                      )
                    }
                    variant="ghost"
                    type="button"
                  >
                    <CopyOutline className="h-4 w-4" />
                  </IconButton>
                </Tooltip>
              </div>
            </div>
          </div>
        </Flex>

        <div className="mt-6">
          <Input
            label={t`Name`}
            placeholder="John Doe"
            validationError={errors.displayName?.message}
            {...register('displayName')}
          />
        </div>
        <div className="relative mt-4">
          <TextArea
            label={t`Bio`}
            placeholder={t`More about you and what you do!`}
            validationError={errors.description?.message}
            {...register('description')}
          />
          <div className="absolute bottom-1.5 right-2">
            <EmojiPicker
              onEmojiSelect={(emoji) =>
                setValue('description', `${getValues('description')}${emoji}`)
              }
            />
          </div>
        </div>
        <div className="mt-4">
          <Input
            label={t`Website`}
            placeholder="https://johndoe.xyz"
            validationError={errors.website?.message}
            {...register('website')}
          />
        </div>
        <div className="mt-4">
          <Input
            label="Youtube"
            placeholder="channel"
            validationError={errors.youtube?.message}
            prefix="https://youtube.com/"
            {...register('youtube')}
          />
        </div>
        <div className="mt-4">
          <Input
            label="Spotify"
            placeholder="artist/6xl0mjD1B4paRyfPDUOynf"
            validationError={errors.spotify?.message}
            prefix="https://open.spotify.com/"
            {...register('spotify')}
          />
        </div>
        <div className="mt-4">
          <Input
            label="X"
            placeholder="profile"
            validationError={errors.x?.message}
            prefix="https://x.com/"
            {...register('x')}
          />
        </div>
        <div className="mt-4">
          <Input
            label={t`Location`}
            placeholder="Metaverse"
            validationError={errors.location?.message}
            {...register('location')}
          />
        </div>
        <div className="mt-4 flex justify-end">
          <Button variant="classic" disabled={loading} highContrast>
            <Trans>Save Profile</Trans>
          </Button>
        </div>
      </form>
    </Card>
  )
}

export default BasicInfo
