import EmojiPicker from '@components/UIElements/EmojiPicker'
import InputMentions from '@components/UIElements/InputMentions'
import { TextArea } from '@components/UIElements/TextArea'
import Tooltip from '@components/UIElements/Tooltip'
import { zodResolver } from '@hookform/resolvers/zod'
import useAppStore from '@lib/store'
import useCollectStore from '@lib/store/idb/collect'
import { Button, Flex, Switch, Text } from '@radix-ui/themes'
import { checkIsBytesVideo } from '@tape.xyz/generic'
import clsx from 'clsx'
import type { FC } from 'react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import type { z } from 'zod'
import { boolean, object, string } from 'zod'

import CollectModule from './CollectModule'
import DropZone from './DropZone'
import MediaCategory from './MediaCategory'
import MediaLicense from './MediaLicense'
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
  const uploadedMedia = useAppStore((state) => state.uploadedMedia)
  const setUploadedMedia = useAppStore((state) => state.setUploadedMedia)
  const saveAsDefault = useCollectStore((state) => state.saveAsDefault)
  const persistedCollectModule = useCollectStore((state) => state.collectModule)

  const isByteSizeVideo = checkIsBytesVideo(uploadedMedia.durationInSeconds)

  const {
    handleSubmit,
    getValues,
    formState: { errors },
    setValue,
    watch,
    clearErrors,
    register
  } = useForm<VideoFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isSensitiveContent: uploadedMedia.isSensitiveContent ?? false,
      title: uploadedMedia.title,
      description: uploadedMedia.description
    }
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
          <div className="tape-border rounded-medium dark:bg-cod bg-white p-5">
            <TextArea
              label="Title"
              placeholder="Title that describes your content"
              autoComplete="off"
              validationError={errors.title?.message}
              {...register('title')}
            />
            <div className="relative mt-4">
              <InputMentions
                label="Description"
                placeholder="Describe more about your content, can also be @profile, #hashtags or chapters (00:20 - Intro)"
                value={watch('description')}
                onContentChange={(value) => {
                  setValue('description', value)
                  clearErrors('description')
                }}
                rows={5}
                validationError={errors.description?.message}
                autoComplete="off"
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

            <div className="mt-4 space-y-4">
              <MediaCategory />
              <ReferenceModule />
              <MediaLicense />
            </div>

            <div className="mt-4">
              <Text as="label">
                <Flex gap="2" align="center">
                  <Switch
                    highContrast
                    checked={!uploadedMedia.collectModule.isRevertCollect}
                    onCheckedChange={(canCollect) => {
                      const collectModuleData = {
                        ...uploadedMedia.collectModule,
                        isRevertCollect: !canCollect
                      }
                      const collectModule = saveAsDefault
                        ? {
                            ...persistedCollectModule,
                            isRevertCollect: !canCollect
                          } ?? collectModuleData
                        : collectModuleData
                      setUploadedMedia({ collectModule })
                    }}
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
                        checked={Boolean(uploadedMedia.isByteVideo)}
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
          variant="soft"
          disabled={uploadedMedia.loading}
          onClick={() => onCancel()}
        >
          Reset
        </Button>
        <Button
          highContrast
          disabled={
            uploadedMedia.loading ||
            uploadedMedia.uploadingThumbnail ||
            uploadedMedia.durationInSeconds === 0
          }
          type="submit"
        >
          {uploadedMedia.uploadingThumbnail
            ? 'Uploading poster...'
            : uploadedMedia.buttonText}
        </Button>
      </div>
    </form>
  )
}

export default Details
