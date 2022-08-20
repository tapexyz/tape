import Alert from '@components/Common/Alert'
import { Button } from '@components/UIElements/Button'
import { Input } from '@components/UIElements/Input'
import RadioInput from '@components/UIElements/RadioInput'
import { TextArea } from '@components/UIElements/TextArea'
import { zodResolver } from '@hookform/resolvers/zod'
import useAppStore from '@lib/store'
import clsx from 'clsx'
import React, { FC, ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { AiFillCloseCircle } from 'react-icons/ai'
import { z } from 'zod'

import Category from './Category'
import CollectModuleType from './CollectModuleType'
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
    .min(5, { message: 'Title should be atleast 5 characters' })
    .max(100, { message: 'Title should not exceed 100 characters' }),
  description: z
    .string()
    .max(5000, { message: 'Description should not exceed 5000 characters' }),
  isSensitiveContent: z.boolean(),
  disableComments: z.boolean(),
  acceptTerms: z.boolean({
    invalid_type_error: 'You must accept Terms'
  })
})

export type VideoFormData = z.infer<typeof formSchema>

type Props = {
  onUpload: () => void
  onCancel: () => void
}

const Details: FC<Props> = ({ onUpload, onCancel }) => {
  const uploadedVideo = useAppStore((state) => state.uploadedVideo)
  const setUploadedVideo = useAppStore((state) => state.setUploadedVideo)

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    setValue,
    watch
  } = useForm<VideoFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isSensitiveContent: uploadedVideo.isSensitiveContent ?? false,
      acceptTerms: false,
      disableComments: uploadedVideo.disableComments ?? false,
      title: uploadedVideo.title,
      description: uploadedVideo.description
    }
  })

  const onSubmitForm = (data: VideoFormData) => {
    setUploadedVideo(data)
    onUpload()
  }

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      <div className="grid h-full gap-5 md:grid-cols-2">
        <div className="flex flex-col justify-between">
          <div>
            <div className="relative">
              <Input
                {...register('title')}
                label="Title"
                placeholder="Title that describes your video"
                autoComplete="off"
                validationError={errors.title?.message}
                autoFocus
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
              <TextArea
                {...register('description')}
                label="Description"
                placeholder="Describe more about your video, can be hashtags or chapters"
                autoComplete="off"
                validationError={errors.description?.message}
                rows={5}
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
              <span className="text-sm opacity-70">
                Use
                <button
                  type="button"
                  onClick={() =>
                    setValue(
                      'description',
                      `${getValues('description')} #bytes`
                    )
                  }
                  className="mx-1 text-indigo-600 outline-none dark:text-indigo-400"
                >
                  #bytes
                </button>
                in description to upload video as Bytes
              </span>
            </div>
            <div className="mt-4">
              <CollectModuleType />
            </div>
            <div className="mt-4">
              <Category />
            </div>
            <div className="mt-4">
              <RadioInput
                checked={watch('disableComments')}
                onChange={(checked) => {
                  setValue('disableComments', checked)
                }}
                question={
                  <span>Allow only subscribers to comment and mirror?</span>
                }
              />
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
          <div className="flex mt-6">
            <input
              id="default-checkbox"
              type="checkbox"
              checked={watch('acceptTerms')}
              onChange={(e) => {
                setValue('acceptTerms', e.target.checked)
              }}
              value=""
              required
              className="w-4 h-4 mt-[1px] text-indigo-600 bg-gray-100 border-gray-300 rounded-lg focus:outline-none dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              htmlFor="default-checkbox"
              className="ml-2 text-sm opacity-80"
            >
              I own the content and it does not contain illegal information.
            </label>
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
          <Button disabled={uploadedVideo.loading} type="submit">
            {uploadedVideo.buttonText}
          </Button>
        </div>
      )}
    </form>
  )
}

export default Details
