import type { ProfileOptions } from '@lens-protocol/metadata'
import type { OnchainSetProfileMetadataRequest, Profile } from '@tape.xyz/lens'
import type {
  CustomErrorWithData,
  IPFSUploadResult
} from '@tape.xyz/lens/custom-types'
import type { z } from 'zod'

import Badge from '@components/Common/Badge'
import AddImageOutline from '@components/Common/Icons/AddImageOutline'
import CopyOutline from '@components/Common/Icons/CopyOutline'
import EmojiPicker from '@components/UIElements/EmojiPicker'
import { Input } from '@components/UIElements/Input'
import { TextArea } from '@components/UIElements/TextArea'
import Tooltip from '@components/UIElements/Tooltip'
import { zodResolver } from '@hookform/resolvers/zod'
import useHandleWrongNetwork from '@hooks/useHandleWrongNetwork'
import {
  MetadataAttributeType,
  profile as profileMetadata
} from '@lens-protocol/metadata'
import { Button, Flex, IconButton, Text } from '@radix-ui/themes'
import { LENSHUB_PROXY_ABI } from '@tape.xyz/abis'
import { uploadToIPFS, useCopyToClipboard } from '@tape.xyz/browser'
import {
  ERROR_MESSAGE,
  LENSHUB_PROXY_ADDRESS,
  REQUESTING_SIGNATURE_MESSAGE,
  TAPE_APP_ID,
  TAPE_WEBSITE_URL
} from '@tape.xyz/constants'
import {
  checkLensManagerPermissions,
  EVENTS,
  getProfile,
  getProfileCoverPicture,
  getProfilePicture,
  getSignature,
  getValueFromKeyInAttributes,
  imageCdn,
  logger,
  sanitizeDStorageUrl,
  Tower,
  trimify,
  uploadToAr
} from '@tape.xyz/generic'
import {
  useBroadcastOnchainMutation,
  useCreateOnchainSetProfileMetadataTypedDataMutation,
  useSetProfileMetadataMutation
} from '@tape.xyz/lens'
import { Loader } from '@tape.xyz/ui'
import clsx from 'clsx'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { v4 as uuidv4 } from 'uuid'
import { useContractWrite, useSignTypedData } from 'wagmi'
import { object, string, union } from 'zod'

type Props = {
  profile: Profile
}

const formSchema = object({
  description: string().max(500, {
    message: 'Description should not exceed 500 characters'
  }),
  displayName: string().max(30, {
    message: 'Name should not exceed 30 characters'
  }),
  location: string(),
  spotify: string(),
  website: union([
    string().url({
      message: 'Invalid website URL'
    }),
    string().max(0)
  ]),
  x: string(),
  youtube: string()
})
type FormData = z.infer<typeof formSchema> & { coverImage?: string }

const BasicInfo = ({ profile }: Props) => {
  const [copy] = useCopyToClipboard()
  const [loading, setLoading] = useState(false)
  const [coverImage, setCoverImage] = useState<string>(
    profile.metadata?.coverPicture?.raw.uri
  )
  const [selectedPfp, setSelectedPfp] = useState<null | string>(
    profile.metadata?.picture?.__typename === 'ImageSet'
      ? profile.metadata?.picture.raw.uri
      : null
  )
  const [uploading, setUploading] = useState({ cover: false, pfp: false })
  const handleWrongNetwork = useHandleWrongNetwork()
  const { canBroadcast, canUseLensManager } =
    checkLensManagerPermissions(profile)

  const {
    formState: { errors },
    getValues,
    handleSubmit,
    register,
    setValue
  } = useForm<FormData>({
    defaultValues: {
      description: profile.metadata?.bio ?? '',
      displayName: profile.metadata?.displayName ?? '',
      location: getValueFromKeyInAttributes(
        profile.metadata?.attributes,
        'location'
      ),
      spotify: getValueFromKeyInAttributes(
        profile.metadata?.attributes,
        'spotify'
      ),
      website: getValueFromKeyInAttributes(
        profile.metadata?.attributes,
        'website'
      ),
      x: getValueFromKeyInAttributes(profile.metadata?.attributes, 'x'),
      youtube: getValueFromKeyInAttributes(
        profile.metadata?.attributes,
        'youtube'
      )
    },
    resolver: zodResolver(formSchema)
  })

  const onError = (error: CustomErrorWithData) => {
    toast.error(error?.data?.message ?? error?.message ?? ERROR_MESSAGE)
    setLoading(false)
  }

  const onCompleted = (
    __typename?: 'LensProfileManagerRelayError' | 'RelayError' | 'RelaySuccess'
  ) => {
    if (
      __typename === 'RelayError' ||
      __typename === 'LensProfileManagerRelayError'
    ) {
      return
    }
    setLoading(false)
    toast.success('Profile updated')
    Tower.track(EVENTS.PROFILE.UPDATE)
  }

  const { signTypedDataAsync } = useSignTypedData({
    onError
  })

  const { write } = useContractWrite({
    abi: LENSHUB_PROXY_ABI,
    address: LENSHUB_PROXY_ADDRESS,
    functionName: 'setProfileMetadataURI',
    onError,
    onSuccess: () => onCompleted()
  })

  const [broadcast] = useBroadcastOnchainMutation({
    onCompleted: ({ broadcastOnchain }) =>
      onCompleted(broadcastOnchain.__typename),
    onError
  })

  const [createOnchainSetProfileMetadataTypedData] =
    useCreateOnchainSetProfileMetadataTypedDataMutation({
      onCompleted: async ({ createOnchainSetProfileMetadataTypedData }) => {
        const { id, typedData } = createOnchainSetProfileMetadataTypedData
        const { metadataURI, profileId } = typedData.value
        const args = [profileId, metadataURI]
        try {
          toast.loading(REQUESTING_SIGNATURE_MESSAGE)
          if (canBroadcast) {
            const signature = await signTypedDataAsync(getSignature(typedData))
            const { data } = await broadcast({
              variables: { request: { id, signature } }
            })
            if (data?.broadcastOnchain?.__typename === 'RelayError') {
              return write({ args })
            }
            return
          }
          return write({ args })
        } catch {
          setLoading(false)
        }
      },
      onError
    })

  const [setProfileMetadata] = useSetProfileMetadataMutation({
    onCompleted: ({ setProfileMetadata }) =>
      onCompleted(setProfileMetadata.__typename),
    onError
  })

  const otherAttributes =
    profile.metadata?.attributes
      ?.filter(
        (attr) =>
          !['app', 'location', 'spotify', 'website', 'x', 'youtube'].includes(
            attr.key
          )
      )
      .map(({ key, type, value }) => ({
        key,
        type: MetadataAttributeType[type] as any,
        value
      })) ?? []

  const onSaveBasicInfo = async (data: FormData) => {
    if (handleWrongNetwork()) {
      return
    }
    try {
      setLoading(true)
      const metadata: ProfileOptions = {
        appId: TAPE_APP_ID,
        attributes: [
          ...otherAttributes,
          {
            key: 'website',
            type: MetadataAttributeType.STRING,
            value: data.website
          },
          {
            key: 'location',
            type: MetadataAttributeType.STRING,
            value: data.location
          },
          {
            key: 'x',
            type: MetadataAttributeType.STRING,
            value: data.x
          },
          {
            key: 'youtube',
            type: MetadataAttributeType.STRING,
            value: data.youtube
          },
          {
            key: 'spotify',
            type: MetadataAttributeType.STRING,
            value: data.spotify
          },
          {
            key: 'app',
            type: MetadataAttributeType.STRING,
            value: TAPE_APP_ID
          }
        ],
        id: uuidv4()
      }
      metadata.attributes = metadata.attributes?.filter(
        (m) => Boolean(trimify(m.key)) && Boolean(trimify(m.value))
      )
      if (Boolean(trimify(data.description))) {
        metadata.bio = trimify(data.description)
      }
      if (selectedPfp && Boolean(selectedPfp)) {
        metadata.picture = selectedPfp
      }
      if (coverImage && Boolean(coverImage)) {
        metadata.coverPicture = coverImage
      }
      if (Boolean(trimify(data.displayName))) {
        metadata.name = trimify(data.displayName)
      }

      const metadataUri = await uploadToAr(profileMetadata(metadata))
      const request: OnchainSetProfileMetadataRequest = {
        metadataURI: metadataUri
      }

      if (canUseLensManager) {
        const { data } = await setProfileMetadata({
          variables: { request }
        })
        if (
          data?.setProfileMetadata?.__typename ===
          'LensProfileManagerRelayError'
        ) {
          return await createOnchainSetProfileMetadataTypedData({
            variables: { request }
          })
        }
        return
      }
      return await createOnchainSetProfileMetadataTypedData({
        variables: { request }
      })
    } catch (error) {
      setLoading(false)
      logger.error('[On Save Basic Info]', error)
    }
  }

  return (
    <div className="tape-border rounded-medium dark:bg-cod bg-white p-5">
      <form onSubmit={handleSubmit(onSaveBasicInfo)}>
        <div className="relative w-full flex-none">
          {uploading.cover && (
            <div className="rounded-small absolute z-10 flex h-full w-full items-center justify-center bg-black opacity-40">
              <Loader />
            </div>
          )}
          <img
            alt="No cover found"
            className="rounded-small bg-brand-500 h-48 w-full object-cover object-center md:h-56"
            draggable={false}
            src={
              sanitizeDStorageUrl(coverImage) ||
              imageCdn(
                sanitizeDStorageUrl(getProfileCoverPicture(profile)),
                'THUMBNAIL'
              )
            }
          />
          <div className="absolute bottom-2 right-2 cursor-pointer text-sm">
            <Button
              className="!px-0"
              highContrast
              type="button"
              variant="surface"
            >
              <label className="p-3" htmlFor="chooseCover">
                Choose
                <input
                  accept=".png, .jpg, .jpeg, .svg, .webp"
                  className="hidden w-full"
                  id="chooseCover"
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
                  type="file"
                />
              </label>
            </Button>
          </div>
        </div>
        <Flex align="center" gap="5" mt="5" wrap="wrap">
          <div className="group relative flex-none overflow-hidden rounded-full">
            <img
              alt="No PFP"
              className="size-32 rounded-full border-2 object-cover"
              draggable={false}
              src={
                selectedPfp
                  ? sanitizeDStorageUrl(selectedPfp)
                  : getProfilePicture(profile, 'AVATAR_LG')
              }
            />
            <label
              className={clsx(
                'invisible absolute top-0 grid size-32 cursor-pointer place-items-center rounded-full bg-white bg-opacity-70 backdrop-blur-lg group-hover:visible dark:bg-black',
                { '!visible': uploading.pfp }
              )}
              htmlFor="choosePfp"
            >
              {uploading.pfp ? (
                <Loader />
              ) : (
                <AddImageOutline className="size-5" />
              )}
              <input
                accept=".png, .jpg, .jpeg, .svg, .gif, .webp"
                className="hidden w-full"
                id="choosePfp"
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
                type="file"
              />
            </label>
          </div>
          <div>
            <Text as="div" className="opacity-70" size="2" weight="medium">
              Profile
            </Text>
            <div className="flex items-center space-x-3">
              <h6 className="flex items-center space-x-1">
                <span>{getProfile(profile)?.slug}</span>
                <Badge id={profile?.id} size="xs" />
              </h6>
            </div>
            <div className="mt-4">
              <Text as="div" className="opacity-70" size="2" weight="medium">
                Permalink
              </Text>
              <div className="flex items-center space-x-2">
                <span>
                  {TAPE_WEBSITE_URL}/u/
                  {getProfile(profile)?.slug}
                </span>
                <Tooltip content="Copy" placement="top">
                  <IconButton
                    className="hover:opacity-60 focus:outline-none"
                    onClick={async () =>
                      await copy(
                        `${TAPE_WEBSITE_URL}/u/${getProfile(profile)?.slug}`
                      )
                    }
                    type="button"
                    variant="ghost"
                  >
                    <CopyOutline className="size-4" />
                  </IconButton>
                </Tooltip>
              </div>
            </div>
          </div>
        </Flex>

        <div className="mt-6">
          <Input
            label="Name"
            placeholder="John Doe"
            validationError={errors.displayName?.message}
            {...register('displayName')}
          />
        </div>
        <div className="relative mt-4">
          <TextArea
            label="Bio"
            placeholder="More about you and what you do!"
            rows={5}
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
            label="Website"
            placeholder="https://johndoe.xyz"
            validationError={errors.website?.message}
            {...register('website')}
          />
        </div>
        <div className="mt-4">
          <Input
            label="Youtube"
            placeholder="channel"
            prefix="https://youtube.com/"
            validationError={errors.youtube?.message}
            {...register('youtube')}
          />
        </div>
        <div className="mt-4">
          <Input
            label="Spotify"
            placeholder="artist/6xl0mjD1B4paRyfPDUOynf"
            prefix="https://open.spotify.com/"
            validationError={errors.spotify?.message}
            {...register('spotify')}
          />
        </div>
        <div className="mt-4">
          <Input
            label="X (Twitter)"
            placeholder="profile"
            prefix="https://x.com/"
            validationError={errors.x?.message}
            {...register('x')}
          />
        </div>
        <div className="mt-4">
          <Input
            label="Location"
            placeholder="Cybertron"
            validationError={errors.location?.message}
            {...register('location')}
          />
        </div>
        <div className="mt-6 flex justify-end">
          <Button disabled={loading} highContrast>
            {loading && <Loader size="sm" />}
            Update Profile
          </Button>
        </div>
      </form>
    </div>
  )
}

export default BasicInfo
