import Alert from '@components/Common/Alert'
import { Button } from '@components/UIElements/Button'
import InputMentions from '@components/UIElements/InputMentions'
import RadioInput from '@components/UIElements/RadioInput'
import { zodResolver } from '@hookform/resolvers/zod'
import useAppStore from '@lib/store'
import { Mixpanel, TRACK } from '@utils/track'
import clsx from 'clsx'
import React, { FC, ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { AiFillCloseCircle } from 'react-icons/ai'
import { MdOutlineSlowMotionVideo } from 'react-icons/md'
import { z } from 'zod'

import Category from './Category'
import CollectModuleType from './CollectModuleType'
import ReferenceModuleType from './ReferenceModuleType'
import Video from './Video'

const ContentAlert = ({ message }: { message: ReactNode }) => (
  <div className="mt-6">
    <Alert variant="danger">
      <span className="inline-flex items-center text-sm">
        <AiFillCloseCircle className="mr-3 text-xl text-red-500" />
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
                autoFocus
                mentionsSelector="input-mentions-single"
              />
              <div className="absolute top-0 flex items-center justify-end mt-1 right-1">
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
              <div className="absolute top-0 flex items-center justify-end mt-1 right-1">
                <span
                  className={clsx('text-[10px] opacity-50', {
                    'text-red-500 !opacity-100':
                      watch('description')?.length > 5000
                  })}
                >
                  {watch('description')?.length}/5000
                </span>
              </div>
              <div className="flex mt-2 text-opacity-80 text-black text-sm items-center px-3 py-1 space-x-1.5 font-medium rounded-full bg-gradient-to-br from-orange-200 to-orange-100">
                <MdOutlineSlowMotionVideo className="flex-none text-base" />
                <span>
                  Try adding
                  <button
                    type="button"
                    onClick={() => {
                      setValue(
                        'description',
                        `${getValues('description')} #bytes`
                      )
                      Mixpanel.track(TRACK.CLICKED_BYTES_TAG_AT_UPLOAD)
                    }}
                    className="mx-1 text-indigo-600 outline-none dark:text-indigo-400"
                  >
                    #bytes
                  </button>
                  in your description to upload this video as Bytes
                </span>
              </div>
            </div>
            <div className="mt-4">
              <CollectModuleType />
            </div>
            <div className="mt-4">
              <Category />
            </div>
            <div className="mt-4">
              <ReferenceModuleType />
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
        <div className="flex items-center justify-end mt-6">
          <Button variant="secondary" onClick={() => onCancel()} type="button">
            Cancel
          </Button>
          <Button
            loading={uploadedVideo.loading || uploadedVideo.uploadingThumbnail}
            disabled={uploadedVideo.loading || uploadedVideo.uploadingThumbnail}
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
