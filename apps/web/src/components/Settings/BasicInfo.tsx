import Badge from '@components/Common/Badge'
import AddImageOutline from '@components/Common/Icons/AddImageOutline'
import CopyOutline from '@components/Common/Icons/CopyOutline'
import EmojiPicker from '@components/UIElements/EmojiPicker'
import { Input } from '@components/UIElements/Input'
import { TextArea } from '@components/UIElements/TextArea'
import Tooltip from '@components/UIElements/Tooltip'
import { LENSHUB_PROXY_ABI } from '@dragverse/abis'
import { uploadToIPFS, useCopyToClipboard } from '@dragverse/browser'
import {
  ERROR_MESSAGE,
  LENSHUB_PROXY_ADDRESS,
  REQUESTING_SIGNATURE_MESSAGE,
  TAPE_APP_ID,
  TAPE_WEBSITE_URL
} from '@dragverse/constants'
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
} from '@dragverse/generic'
import type { OnchainSetProfileMetadataRequest, Profile } from '@dragverse/lens'
import {
  useBroadcastOnchainMutation,
  useCreateOnchainSetProfileMetadataTypedDataMutation,
  useSetProfileMetadataMutation
} from '@dragverse/lens'
import type {
  CustomErrorWithData,
  IPFSUploadResult
} from '@dragverse/lens/custom-types'
import { Loader } from '@dragverse/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import useHandleWrongNetwork from '@hooks/useHandleWrongNetwork'
import type { ProfileOptions } from '@lens-protocol/metadata'
import {
  MetadataAttributeType,
  profile as profileMetadata
} from '@lens-protocol/metadata'
import { Button, Flex, IconButton, Text } from '@radix-ui/themes'
import clsx from 'clsx'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { v4 as uuidv4 } from 'uuid'
import { useContractWrite, useSignTypedData } from 'wagmi'
import type { z } from 'zod'
import { object, string, union } from 'zod'

type Props = {
  profile: Profile
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

const BasicInfo = ({ profile }: Props) => {
  const [copy] = useCopyToClipboard()
  const [loading, setLoading] = useState(false)
  const [coverImage, setCoverImage] = useState<string>(
    profile.metadata?.coverPicture?.raw.uri
  )
  const [selectedPfp, setSelectedPfp] = useState<string | null>(
    profile.metadata?.picture?.__typename === 'ImageSet'
      ? profile.metadata?.picture.raw.uri
      : null
  )
  const [uploading, setUploading] = useState({ pfp: false, cover: false })
  const handleWrongNetwork = useHandleWrongNetwork()
  const { canUseLensManager, canBroadcast } =
    checkLensManagerPermissions(profile)

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      displayName: profile.metadata?.displayName ?? '',
      description: profile.metadata?.bio ?? '',
      location: getValueFromKeyInAttributes(
        profile.metadata?.attributes,
        'location'
      ),
      x: getValueFromKeyInAttributes(profile.metadata?.attributes, 'x'),
      youtube: getValueFromKeyInAttributes(
        profile.metadata?.attributes,
        'youtube'
      ),
      spotify: getValueFromKeyInAttributes(
        profile.metadata?.attributes,
        'spotify'
      ),
      website: getValueFromKeyInAttributes(
        profile.metadata?.attributes,
        'website'
      )
    }
  })

  const onError = (error: CustomErrorWithData) => {
    toast.error(error?.data?.message ?? error?.message ?? ERROR_MESSAGE)
    setLoading(false)
  }

  const onCompleted = (
    __typename?: 'RelayError' | 'RelaySuccess' | 'LensProfileManagerRelayError'
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

  const [createOnchainSetProfileMetadataTypedData] =
    useCreateOnchainSetProfileMetadataTypedDataMutation({
      onCompleted: async ({ createOnchainSetProfileMetadataTypedData }) => {
        const { typedData, id } = createOnchainSetProfileMetadataTypedData
        const { profileId, metadataURI } = typedData.value
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
          !['website', 'location', 'x', 'youtube', 'spotify', 'app'].includes(
            attr.key
          )
      )
      .map(({ key, value, type }) => ({
        key,
        value,
        type: MetadataAttributeType[type] as any
      })) ?? []

  const onSaveBasicInfo = async (data: FormData) => {
    if (handleWrongNetwork()) {
      return
    }
    try {
      setLoading(true)
      const metadata: ProfileOptions = {
        appId: TAPE_APP_ID,
        id: uuidv4(),
        attributes: [
          ...otherAttributes,
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
            value: TAPE_APP_ID
          }
        ]
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
            <div className="rounded-small absolute z-10 flex h-full w-full items-center justify-center bg-brand-850 opacity-40">
              <Loader />
            </div>
          )}
          <img
            src={
              sanitizeDStorageUrl(coverImage) ||
              imageCdn(
                sanitizeDStorageUrl(getProfileCoverPicture(profile)),
                'THUMBNAIL'
              )
            }
            className="rounded-small bg-brand-500 h-48 w-full object-cover object-center md:h-56"
            draggable={false}
            alt="No cover found"
          />
          <div className="absolute bottom-2 right-2 cursor-pointer text-sm">
            <Button
              highContrast
              type="button"
              variant="surface"
              className="!px-0"
            >
              <label htmlFor="chooseCover" className="p-3">
                Choose
                <input
                  id="chooseCover"
                  type="file"
                  accept=".png, .jpg, .jpeg, .svg, .webp"
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
                  : getProfilePicture(profile, 'AVATAR_LG')
              }
              className="h-32 w-32 rounded-full border-2 object-cover"
              draggable={false}
              alt="No PFP"
            />
            <label
              htmlFor="choosePfp"
              className={clsx(
                'invisible absolute top-0 grid h-32 w-32 cursor-pointer place-items-center rounded-full bg-white bg-opacity-70 backdrop-blur-lg group-hover:visible dark:bg-brand-850',
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
                accept=".png, .jpg, .jpeg, .svg, .gif, .webp"
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
            label="Name"
            placeholder="John Doe"
            validationError={errors.displayName?.message}
            {...register('displayName')}
          />
        </div>
        <div className="relative mt-4">
          <TextArea
            label="Bio"
            rows={5}
            placeholder="More about you and what you do!"
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
            label="X (Twitter)"
            placeholder="profile"
            validationError={errors.x?.message}
            prefix="https://x.com/"
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
