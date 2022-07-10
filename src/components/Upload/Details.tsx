import { Button } from '@components/UIElements/Button'
import { Input } from '@components/UIElements/Input'
import RadioInput from '@components/UIElements/RadioInput'
import { TextArea } from '@components/UIElements/TextArea'
import { zodResolver } from '@hookform/resolvers/zod'
import useAppStore from '@lib/store'
import clsx from 'clsx'
import React, { FC } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import ChooseThumbnail from './ChooseThumbnail'
import CollectModuleType from './CollectModuleType'
import Video from './Video'

const formSchema = z.object({
  title: z
    .string()
    .min(5, { message: 'Title should be atleast 5 characters' })
    .max(100, { message: 'Title should not exceed 100 characters' }),
  description: z
    .string()
    .max(5000, { message: 'Description should not exceed 5000 characters' }),
  thumbnail: z.string(),
  isAdultContent: z.boolean(),
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
  const { uploadedVideo, setUploadedVideo } = useAppStore()
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
      isAdultContent: false,
      acceptTerms: false,
      disableComments: false
    }
  })

  const onSubmitForm = (data: VideoFormData) => {
    setUploadedVideo(data)
    onUpload()
  }

  const onThumbnailUpload = (ipfsUrl: string, thumbnailType: string) => {
    setUploadedVideo({ thumbnail: ipfsUrl, thumbnailType })
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
                    'text-red-500 !opacity-100':
                      getValues('title')?.length > 100
                  })}
                >
                  {getValues('title')?.length}/100
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
                      getValues('description')?.length > 5000
                  })}
                >
                  {getValues('description')?.length}/5000
                </span>
              </div>
            </div>
            <div className="mt-4">
              <ChooseThumbnail
                label="Thumbnail"
                file={uploadedVideo.file}
                afterUpload={(ipfsUrl: string, thumbnailType: string) => {
                  if (ipfsUrl) {
                    setValue('thumbnail', ipfsUrl)
                    onThumbnailUpload(ipfsUrl, thumbnailType)
                  }
                }}
              />
              {errors?.thumbnail?.message && (
                <p className="text-xs font-medium text-red-500">
                  {errors?.thumbnail?.message}
                </p>
              )}
            </div>
            <div className="mt-4">
              <CollectModuleType />
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
                checked={watch('isAdultContent')}
                onChange={(checked) => {
                  setValue('isAdultContent', checked)
                }}
                question={
                  <span>
                    Do you want to restrict this video to an{' '}
                    <span className="font-semibold">adult</span> audience?
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
              I own the content and it does not contain illegal or sensitive
              information.
            </label>
          </div>
        </div>
        <div className="flex flex-col items-start justify-between">
          <Video />
        </div>
      </div>
      <div className="flex items-center justify-end mt-6">
        <Button variant="secondary" onClick={() => onCancel()} type="button">
          Cancel
        </Button>
        <Button disabled={uploadedVideo.loading} type="submit">
          {uploadedVideo.buttonText}
        </Button>
      </div>
    </form>
  )
}

export default Details
