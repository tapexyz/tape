import { Button } from '@components/UIElements/Button'
import { Input } from '@components/UIElements/Input'
import { TextArea } from '@components/UIElements/TextArea'
import { zodResolver } from '@hookform/resolvers/zod'
import useAppStore from '@lib/store'
import clsx from 'clsx'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import ChooseThumbnail from './ChooseThumbnail'
import Video from './Video'

const formSchema = z.object({
  title: z
    .string()
    .min(5, { message: 'Title should be atleast 5 characters' })
    .max(100, { message: 'Title should not exceed 100 characters' }),
  description: z
    .string()
    .max(100, { message: 'Title should not exceed 100 characters' }),
  thumbnail: z.string()
})

type FormData = z.infer<typeof formSchema>
const Details = () => {
  const { uploadedVideo, setUploadedVideo } = useAppStore()
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    setValue
  } = useForm<FormData>({
    resolver: zodResolver(formSchema)
  })

  const onSubmitForm = (data: FormData) => {
    console.log('🚀 ~ file: Details.tsx ~ line 62 ~ onSubmitForm ~ data', data)
  }

  const onThumbnailUpload = (ipfsUrl: string) => {
    setUploadedVideo({ ...uploadedVideo, thumbnail: ipfsUrl })
  }

  return (
    <form
      className="max-w-6xl gap-5 mx-auto"
      onSubmit={handleSubmit(onSubmitForm)}
    >
      <div className="grid h-full gap-5 md:grid-cols-2">
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
                  'text-red-500 !opacity-100': getValues('title')?.length > 100
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
              placeholder="Describe more about your video"
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
              afterUpload={(ipfsUrl: string) => {
                if (ipfsUrl) {
                  setValue('thumbnail', ipfsUrl)
                  onThumbnailUpload(ipfsUrl)
                }
              }}
            />
            {errors?.thumbnail?.message && (
              <p className="text-xs font-medium text-red-500">
                {errors?.thumbnail?.message}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col items-start justify-between">
          <Video />
        </div>
      </div>
      <div className="flex items-center justify-end mt-4">
        <Button>Next</Button>
      </div>
    </form>
  )
}

export default Details
