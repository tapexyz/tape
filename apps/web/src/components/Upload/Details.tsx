import Alert from '@components/Common/Alert'
import BytesOutline from '@components/Common/Icons/BytesOutline'
import TimesOutline from '@components/Common/Icons/TimesOutline'
import { Button } from '@components/UIElements/Button'
import EmojiPicker from '@components/UIElements/EmojiPicker'
import InputMentions from '@components/UIElements/InputMentions'
import RadioInput from '@components/UIElements/RadioInput'
import { zodResolver } from '@hookform/resolvers/zod'
import useAppStore from '@lib/store'
import clsx from 'clsx'
import type { FC, ReactNode } from 'react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import Category from './Category'
import CollectModule from './CollectModule'
import ReferenceModule from './ReferenceModule'
import Video from './Video'

const ContentAlert = ({ message }: { message: ReactNode }) => (
  <div className="mt-6">
    <Alert variant="danger">
      <span className="inline-flex items-center text-sm">
        <TimesOutline className="mr-3 h-5 w-5 text-red-500" />
        {message}
      </span>
    </Alert>
  </div>
)

const formSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, { message: 'Title should be atleast 5 characters' })
    .max(100, { message: 'Title should not exceed 100 characters' }),
  description: z
    .string()
    .trim()
    .max(5000, { message: 'Description should not exceed 5000 characters' }),
  isSensitiveContent: z.boolean()
})

export type VideoFormData = z.infer<typeof formSchema>

type Props = {
  onUpload: (data: VideoFormData) => void
  onCancel: () => void
}

const Details: FC<Props> = ({ onUpload, onCancel }) => {
  const uploadedVideo = useAppStore((state) => state.uploadedVideo)

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
    onUpload(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      <div className="grid h-full gap-5 md:grid-cols-2">
        <div className="flex flex-col justify-between">
          <div>
            <div className="relative">
              <InputMentions
                label="Title"
                placeholder="Title that describes your video"
                autoComplete="off"
                validationError={errors.title?.message}
                value={watch('title')}
                onContentChange={(value) => {
                  setValue('title', value)
                  clearErrors('title')
                }}
                mentionsSelector="input-mentions-single"
              />
              <div className="absolute top-0 right-1 mt-1 flex items-center justify-end">
                <span
                  className={clsx('text-[10px] opacity-50', {
                    'text-red-500 !opacity-100': watch('title')?.length > 100
                  })}
                >
                  {watch('title')?.length}/100
                </span>
              </div>
            </div>
            <div className="relative mt-4">
              <InputMentions
                label="Description"
                placeholder="Describe more about your video, can be @channels, #hashtags or chapters (00:20 - Intro)"
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
              <div className="absolute bottom-1.5 right-1.5">
                <EmojiPicker
                  onEmojiSelect={(emoji) =>
                    setValue(
                      'description',
                      `${getValues('description')}${emoji}`
                    )
                  }
                />
              </div>
              <div className="absolute top-0 right-1 mt-1 flex items-center justify-end">
                <span
                  className={clsx('text-[10px] opacity-50', {
                    'text-red-500 !opacity-100':
                      watch('description')?.length > 5000
                  })}
                >
                  {watch('description')?.length}/5000
                </span>
              </div>
            </div>
            <div className="mt-2 flex items-center space-x-1.5 rounded-full bg-gradient-to-br from-orange-200 to-orange-100 px-3 py-1 text-sm font-medium text-black text-opacity-80">
              <BytesOutline className="h-4 w-4 flex-none" />
              <span>
                Using
                <button
                  type="button"
                  onClick={() => {
                    setValue(
                      'description',
                      `${getValues('description')} #bytes`
                    )
                  }}
                  className="mx-1 text-indigo-600 outline-none dark:text-indigo-400"
                >
                  #bytes
                </button>
                in description will upload this as a short form video.
              </span>
            </div>
            <div className="mt-4">
              <CollectModule />
            </div>
            <div className="mt-4">
              <Category />
            </div>
            <div className="mt-4">
              <ReferenceModule />
            </div>
            <div className="mt-4">
              <RadioInput
                checked={watch('isSensitiveContent')}
                onChange={(checked) => {
                  setValue('isSensitiveContent', checked)
                }}
                question={
                  <span>
                    Does this video contain sensitive information that targets
                    an adult audience?
                  </span>
                }
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col items-start justify-between">
          <Video />
        </div>
      </div>
      {uploadedVideo.isNSFWThumbnail ? (
        <ContentAlert
          message={
            <span>
              Sorry! <b className="px-0.5">Selected thumbnail</b> image has
              tripped some content warnings. It contains NSFW content, choose
              different image to post.
            </span>
          }
        />
      ) : uploadedVideo.isNSFW ? (
        <ContentAlert
          message={
            <span>
              Sorry! Something about this video has tripped some content
              warnings. It contains NSFW content in some frames, and so the
              video is not allowed to post on Lenstube!
            </span>
          }
        />
      ) : (
        <div className="mt-4 flex items-center justify-end space-x-2">
          <Button type="button" variant="hover" onClick={() => onCancel()}>
            Reset
          </Button>
          <Button
            loading={uploadedVideo.loading || uploadedVideo.uploadingThumbnail}
            type="submit"
          >
            {uploadedVideo.uploadingThumbnail
              ? 'Uploading thumbnail'
              : uploadedVideo.buttonText}
          </Button>
        </div>
      )}
    </form>
  )
}

export default Details
