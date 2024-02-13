import EmojiPicker from '@components/UIElements/EmojiPicker'
import { zodResolver } from '@hookform/resolvers/zod'
import useHandleWrongNetwork from '@hooks/useHandleWrongNetwork'
import type { ProfileOptions } from '@lens-protocol/metadata'
import {
  MetadataAttributeType,
  profile as profileMetadata
} from '@lens-protocol/metadata'
import { LENSHUB_PROXY_ABI } from '@tape.xyz/abis'
import { tw, uploadToIPFS } from '@tape.xyz/browser'
import {
  ERROR_MESSAGE,
  LENSHUB_PROXY_ADDRESS,
  REQUESTING_SIGNATURE_MESSAGE,
  TAPE_APP_ID
} from '@tape.xyz/constants'
import {
  checkLensManagerPermissions,
  EVENTS,
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
import type { OnchainSetProfileMetadataRequest, Profile } from '@tape.xyz/lens'
import {
  useBroadcastOnchainMutation,
  useCreateOnchainSetProfileMetadataTypedDataMutation,
  useSetProfileMetadataMutation
} from '@tape.xyz/lens'
import type {
  CustomErrorWithData,
  IPFSUploadResult
} from '@tape.xyz/lens/custom-types'
import { AddImageOutline, Button, Input, Spinner, TextArea } from '@tape.xyz/ui'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { v4 as uuidv4 } from 'uuid'
import { useSignTypedData, useWriteContract } from 'wagmi'
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
    mutation: { onError }
  })

  const { writeContractAsync } = useWriteContract({
    mutation: {
      onError,
      onSuccess: () => onCompleted()
    }
  })

  const write = async ({ args }: { args: any[] }) => {
    return await writeContractAsync({
      address: LENSHUB_PROXY_ADDRESS,
      abi: LENSHUB_PROXY_ABI,
      functionName: 'setProfileMetadataURI',
      args
    })
  }

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
              return await write({ args })
            }
            return
          }
          return await write({ args })
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
    await handleWrongNetwork()

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
    <form onSubmit={handleSubmit(onSaveBasicInfo)} className="w-full">
      <div className="relative w-full flex-none">
        {uploading.cover && (
          <div className="rounded-small absolute z-10 flex h-full w-full items-center justify-center bg-black opacity-40">
            <Spinner />
          </div>
        )}
        <img
          src={
            sanitizeDStorageUrl(coverImage) ||
            imageCdn(
              sanitizeDStorageUrl(getProfileCoverPicture(profile, true)),
              'THUMBNAIL'
            )
          }
          className="rounded-small bg-brand-500 h-48 w-full object-cover object-center md:h-56"
          draggable={false}
          alt="No cover found"
        />
        <div className="absolute bottom-2 right-2 cursor-pointer text-sm">
          <Button type="button" variant="secondary">
            <label htmlFor="chooseCover" className="cursor-pointer p-3">
              Choose Cover
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
        <div className="absolute bottom-4 left-5">
          <div className="group relative flex-none overflow-hidden rounded-full">
            <img
              src={
                selectedPfp
                  ? sanitizeDStorageUrl(selectedPfp)
                  : getProfilePicture(profile, 'AVATAR_LG')
              }
              className="size-32 rounded-full border-2 object-cover"
              draggable={false}
              alt="No PFP"
            />
            <label
              htmlFor="choosePfp"
              className={tw(
                'invisible absolute top-0 grid size-32 cursor-pointer place-items-center rounded-full bg-white bg-opacity-70 backdrop-blur-lg group-hover:visible dark:bg-black',
                { visible: uploading.pfp }
              )}
            >
              {uploading.pfp ? (
                <Spinner />
              ) : (
                <AddImageOutline className="size-5" />
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
        </div>
      </div>

      <div className="mt-6">
        <Input
          label="Name"
          placeholder="John Doe"
          error={errors.displayName?.message}
          {...register('displayName')}
        />
      </div>
      <div className="relative mt-4">
        <TextArea
          label="Bio"
          rows={5}
          placeholder="More about you and what you do!"
          error={errors.description?.message}
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
          error={errors.website?.message}
          {...register('website')}
        />
      </div>
      <div className="mt-4">
        <Input
          label="Youtube"
          placeholder="channel"
          error={errors.youtube?.message}
          prefix="https://youtube.com/"
          {...register('youtube')}
        />
      </div>
      <div className="mt-4">
        <Input
          label="Spotify"
          placeholder="artist/6xl0mjD1B4paRyfPDUOynf"
          error={errors.spotify?.message}
          prefix="https://open.spotify.com/"
          {...register('spotify')}
        />
      </div>
      <div className="mt-4">
        <Input
          label="X (Twitter)"
          placeholder="profile"
          error={errors.x?.message}
          prefix="https://x.com/"
          {...register('x')}
        />
      </div>
      <div className="mt-4">
        <Input
          label="Location"
          placeholder="Cybertron"
          error={errors.location?.message}
          {...register('location')}
        />
      </div>
      <div className="mt-6 flex justify-end">
        <Button loading={loading} disabled={loading}>
          Update Profile
        </Button>
      </div>
    </form>
  )
}

export default BasicInfo
