import EmojiPicker from '@components/UIElements/EmojiPicker'
import InputMentions from '@components/UIElements/InputMentions'
import Tooltip from '@components/UIElements/Tooltip'
import { zodResolver } from '@hookform/resolvers/zod'
import useAppStore from '@lib/store'
import { Button, Flex, Switch, Text } from '@radix-ui/themes'
import { checkIsBytesVideo } from '@tape.xyz/generic'
import clsx from 'clsx'
import type { FC } from 'react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import type { z } from 'zod'
import { boolean, object, string } from 'zod'

import Category from './Category'
import CollectModule from './CollectModule'
import DropZone from './DropZone'
import ReferenceModule from './ReferenceModule'
import SelectedMedia from './SelectedMedia'

const formSchema = object({
  title: string()
    .trim()
    .min(5, { message: `Title should be atleast 5 characters` })
    .max(100, { message: `Title should not exceed 100 characters` }),
  description: string()
    .trim()
    .min(5, { message: `Description should be atleast 5 characters` })
    .max(5000, { message: `Description should not exceed 5000 characters` }),
  isSensitiveContent: boolean()
})

export type VideoFormData = z.infer<typeof formSchema>

type Props = {
  onUpload: (data: VideoFormData) => void
  onCancel: () => void
}

const Details: FC<Props> = ({ onUpload, onCancel }) => {
  const { uploadedVideo, setUploadedVideo } = useAppStore()

  const isByteSizeVideo = checkIsBytesVideo(uploadedVideo.durationInSeconds)

  const {
    handleSubmit,
    getValues,
    formState: { errors },
    setValue,
    watch,
    clearErrors
  } = useForm<VideoFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isSensitiveContent: uploadedVideo.isSensitiveContent ?? false,
      title: uploadedVideo.title,
      description: uploadedVideo.description
    }
  })

  const onSubmitForm = (data: VideoFormData) => {
    if (!uploadedVideo.file) {
      return toast.error(`Please choose a media to upload`)
    }
    if (!uploadedVideo.thumbnail?.length) {
      return toast.error(`Please select or upload a thumbnail`)
    }
    onUpload(data)
  }

  const toggleUploadAsByte = (enable: boolean) => {
    if (isByteSizeVideo && enable) {
      return setUploadedVideo({ isByteVideo: true })
    }
    setUploadedVideo({ isByteVideo: false })
  }

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      <div className="grid h-full gap-5 md:grid-cols-2">
        <div className="flex flex-col items-start justify-between">
          {uploadedVideo.file ? <SelectedMedia /> : <DropZone />}
        </div>
        <div className="flex flex-col justify-between">
          <div>
            <div className="relative">
              <InputMentions
                label="Title"
                placeholder="Title that describes your content"
                autoComplete="off"
                validationError={errors.title?.message}
                value={watch('title')}
                onContentChange={(value) => {
                  setValue('title', value)
                  clearErrors('title')
                }}
                mentionsSelector="input-mentions-single"
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
                label="Description"
                placeholder="Describe more about your content, can also be @profile, #hashtags or chapters (00:20 - Intro)"
                autoComplete="off"
                validationError={errors.description?.message}
                value={watch('description')}
                onContentChange={(value) => {
                  setValue('description', value)
                  clearErrors('description')
                }}
                rows={5}
                mentionsSelector="input-mentions-textarea"
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
                <Category />
                <ReferenceModule />
              </Flex>
            </div>

            <div className="mt-4">
              <Text as="label">
                <Flex gap="2" align="center">
                  <Switch
                    highContrast
                    checked={!uploadedVideo.collectModule.isRevertCollect}
                    onCheckedChange={(canCollect) =>
                      setUploadedVideo({
                        collectModule: {
                          ...uploadedVideo.collectModule,
                          isRevertCollect: !canCollect
                        }
                      })
                    }
                  />
                  Collectible
                </Flex>
              </Text>
              {!uploadedVideo.collectModule.isRevertCollect && (
                <CollectModule />
              )}
            </div>

            {uploadedVideo.file && (
              <Tooltip
                visible={!isByteSizeVideo}
                content="Please note that only videos under 2 minutes in length can be uploaded as bytes"
              >
                <div
                  className={clsx(
                    'mt-2',
                    !isByteSizeVideo && 'cursor-not-allowed opacity-50'
                  )}
                >
                  <Text as="label">
                    <Flex gap="2" align="center">
                      <Switch
                        highContrast
                        checked={Boolean(uploadedVideo.isByteVideo)}
                        onCheckedChange={(b) => toggleUploadAsByte(b)}
                      />
                      Upload this video as short-form bytes
                    </Flex>
                  </Text>
                </div>
              </Tooltip>
            )}

            <div className="mt-2">
              <Text as="label">
                <Flex gap="2" align="center">
                  <Switch
                    highContrast
                    checked={Boolean(watch('isSensitiveContent'))}
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
          type="button"
          color="gray"
          size="3"
          variant="soft"
          disabled={uploadedVideo.loading}
          onClick={() => onCancel()}
        >
          Reset
        </Button>
        <Button
          highContrast
          disabled={
            uploadedVideo.loading ||
            uploadedVideo.uploadingThumbnail ||
            uploadedVideo.durationInSeconds === 0
          }
          type="submit"
          size="3"
        >
          {uploadedVideo.uploadingThumbnail
            ? 'Uploading thumbnail'
            : uploadedVideo.buttonText}
        </Button>
      </div>
    </form>
  )
}

export default Details
