import type { FC } from 'react'
import type { z } from 'zod'

import EmojiPicker from '@components/UIElements/EmojiPicker'
import InputMentions from '@components/UIElements/InputMentions'
import Tooltip from '@components/UIElements/Tooltip'
import { zodResolver } from '@hookform/resolvers/zod'
import useAppStore from '@lib/store'
import useCollectStore from '@lib/store/idb/collect'
import { Button, Flex, Switch, Text } from '@radix-ui/themes'
import { checkIsBytesVideo } from '@tape.xyz/generic'
import clsx from 'clsx'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { boolean, object, string } from 'zod'

import CollectModule from './CollectModule'
import DropZone from './DropZone'
import MediaCategory from './MediaCategory'
import MediaLicense from './MediaLicense'
import ReferenceModule from './ReferenceModule'
import SelectedMedia from './SelectedMedia'

const formSchema = object({
  description: string()
    .trim()
    .min(5, { message: `Description should be atleast 5 characters` })
    .max(5000, { message: `Description should not exceed 5000 characters` }),
  isSensitiveContent: boolean(),
  title: string()
    .trim()
    .min(5, { message: `Title should be atleast 5 characters` })
    .max(100, { message: `Title should not exceed 100 characters` })
})

export type VideoFormData = z.infer<typeof formSchema>

type Props = {
  onCancel: () => void
  onUpload: (data: VideoFormData) => void
}

const Details: FC<Props> = ({ onCancel, onUpload }) => {
  const uploadedMedia = useAppStore((state) => state.uploadedMedia)
  const setUploadedMedia = useAppStore((state) => state.setUploadedMedia)
  const persistedCollectModule = useCollectStore((state) => state.collectModule)

  const isByteSizeVideo = checkIsBytesVideo(uploadedMedia.durationInSeconds)

  const {
    clearErrors,
    formState: { errors },
    getValues,
    handleSubmit,
    setValue,
    watch
  } = useForm<VideoFormData>({
    defaultValues: {
      description: uploadedMedia.description,
      isSensitiveContent: uploadedMedia.isSensitiveContent ?? false,
      title: uploadedMedia.title
    },
    resolver: zodResolver(formSchema)
  })

  const onSubmitForm = (data: VideoFormData) => {
    if (!uploadedMedia.file) {
      return toast.error(`Please choose a media to upload`)
    }
    if (!uploadedMedia.thumbnail?.length) {
      return toast.error(`Please select or upload a thumbnail`)
    }
    onUpload(data)
  }

  const toggleUploadAsByte = (enable: boolean) => {
    if (isByteSizeVideo && enable) {
      return setUploadedMedia({ isByteVideo: true })
    }
    setUploadedMedia({ isByteVideo: false })
  }

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      <div className="flex h-full flex-row flex-wrap gap-4">
        <div className="w-full md:w-2/5">
          {uploadedMedia.file ? <SelectedMedia /> : <DropZone />}
        </div>
        <div className="flex flex-1 flex-col justify-between">
          <div>
            <div className="relative">
              <InputMentions
                autoComplete="off"
                label="Title"
                mentionsSelector="input-mentions-single"
                onContentChange={(value) => {
                  setValue('title', value)
                  clearErrors('title')
                }}
                placeholder="Title that describes your content"
                validationError={errors.title?.message}
                value={watch('title')}
              />
              <div className="absolute right-1 top-0 mt-1 flex items-center justify-end">
                <span
                  className={clsx(
                    'text-xs',
                    watch('title')?.length > 100
                      ? 'text-red-500 opacity-100'
                      : ' opacity-70'
                  )}
                >
                  {watch('title')?.length}/100
                </span>
              </div>
            </div>
            <div className="relative mt-4">
              <InputMentions
                autoComplete="off"
                label="Description"
                mentionsSelector="input-mentions-textarea"
                onContentChange={(value) => {
                  setValue('description', value)
                  clearErrors('description')
                }}
                placeholder="Describe more about your content, can also be @profile, #hashtags or chapters (00:20 - Intro)"
                rows={5}
                validationError={errors.description?.message}
                value={watch('description')}
              />
              <div className="absolute right-2 top-8">
                <EmojiPicker
                  onEmojiSelect={(emoji) =>
                    setValue(
                      'description',
                      `${getValues('description')}${emoji}`
                    )
                  }
                />
              </div>
              <div className="absolute right-1 top-0 mt-1 flex items-center justify-end">
                <span
                  className={clsx(
                    'text-xs',
                    watch('description')?.length > 5000
                      ? 'text-red-500 opacity-100'
                      : ' opacity-70'
                  )}
                >
                  {watch('description')?.length}/5000
                </span>
              </div>
            </div>

            <div className="mt-4">
              <Flex gap="2">
                <MediaCategory />
                <ReferenceModule />
              </Flex>
            </div>

            <div className="mt-2">
              <MediaLicense />
            </div>

            <div className="mt-4">
              <Text as="label">
                <Flex align="center" gap="2">
                  <Switch
                    checked={!uploadedMedia.collectModule.isRevertCollect}
                    highContrast
                    onCheckedChange={(canCollect) =>
                      setUploadedMedia({
                        collectModule: persistedCollectModule ?? {
                          ...uploadedMedia.collectModule,
                          isRevertCollect: !canCollect
                        }
                      })
                    }
                  />
                  Collectible
                </Flex>
              </Text>
              {!uploadedMedia.collectModule.isRevertCollect && (
                <CollectModule />
              )}
            </div>

            {uploadedMedia.file && uploadedMedia.type === 'VIDEO' ? (
              <Tooltip
                content="Please note that only videos under 2 minutes in length can be uploaded as bytes"
                visible={!isByteSizeVideo}
              >
                <div
                  className={clsx(
                    'mt-2',
                    !isByteSizeVideo && 'cursor-not-allowed opacity-50'
                  )}
                >
                  <Text as="label">
                    <Flex align="center" gap="2">
                      <Switch
                        checked={Boolean(uploadedMedia.isByteVideo)}
                        highContrast
                        onCheckedChange={(b) => toggleUploadAsByte(b)}
                      />
                      Upload this video as short-form bytes
                    </Flex>
                  </Text>
                </div>
              </Tooltip>
            ) : null}

            <div className="mt-2">
              <Text as="label">
                <Flex align="center" gap="2">
                  <Switch
                    checked={Boolean(watch('isSensitiveContent'))}
                    highContrast
                    onCheckedChange={(value) =>
                      setValue('isSensitiveContent', value)
                    }
                  />
                  Sensitive content for a general audience
                </Flex>
              </Text>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-end space-x-2">
        <Button
          color="gray"
          disabled={uploadedMedia.loading}
          onClick={() => onCancel()}
          type="button"
          variant="soft"
        >
          Reset
        </Button>
        <Button
          disabled={
            uploadedMedia.loading ||
            uploadedMedia.uploadingThumbnail ||
            uploadedMedia.durationInSeconds === 0
          }
          highContrast
          type="submit"
        >
          {uploadedMedia.uploadingThumbnail
            ? 'Uploading image...'
            : uploadedMedia.buttonText}
        </Button>
      </div>
    </form>
  )
}

export default Details
