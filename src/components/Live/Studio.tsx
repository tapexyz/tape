import MetaTags from '@components/Common/MetaTags'
import { Button } from '@components/UIElements/Button'
import { Input } from '@components/UIElements/Input'
import RadioInput from '@components/UIElements/RadioInput'
import { TextArea } from '@components/UIElements/TextArea'
import ChooseThumbnail from '@components/Upload/ChooseThumbnail'
import { zodResolver } from '@hookform/resolvers/zod'
import trimify from '@utils/functions/trimify'
import axios from 'axios'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { StreamData } from 'src/types/local'
import { z } from 'zod'

import Preview from './Preview'
import StreamDetails from './StreamDetails'

const formSchema = z.object({
  title: z
    .string()
    .min(5, { message: 'Title should be atleast 5 characters' })
    .max(100, { message: 'Title should not exceed 100 characters' }),
  description: z
    .string()
    .max(100, { message: 'Title should not exceed 100 characters' }),
  thumbnail: z.string(),
  thumbnailType: z.string(),
  isAdultContent: z.boolean()
})
export type VideoFormData = z.infer<typeof formSchema>

const Studio = () => {
  const [buttonText, setButtonText] = useState('Create Stream')
  const [loading, setLoading] = useState(false)
  const [stream, setStream] = useState<StreamData>({
    streamKey: '-',
    streamId: '',
    playbackId: '',
    hostUrl: '-'
  })
  const {
    register,
    formState: { errors },
    setValue,
    watch,
    handleSubmit
  } = useForm<VideoFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isAdultContent: false
    }
  })

  const createStream = async (data: VideoFormData) => {
    setLoading(true)
    setButtonText('Creating Stream')
    const response = await axios.post('/api/video/stream', {
      name: trimify(data.title)
    })
    setLoading(false)
    setButtonText('Create Stream')
    if (!response.data.success) return toast.error('Failed to create stream')
    setStream({ ...response.data, hostUrl: 'rtmp://rtmp.livepeer.com/live' })
    setButtonText('Go Live')
  }

  return (
    <div className="max-w-5xl gap-5 mx-auto my-10">
      <MetaTags title="Go Live" />
      <form className="mt-10" onSubmit={handleSubmit(createStream)}>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col flex-1 space-y-4">
            <div>
              <Input
                placeholder="Title that describes your stream"
                autoComplete="off"
                {...register('title')}
                validationError={errors.title?.message}
                label="Title"
              />
            </div>
            <div className="mt-4">
              <TextArea
                rows={5}
                autoComplete="off"
                placeholder="More about your stream"
                {...register('description')}
                validationError={errors.description?.message}
                label="Description"
              />
            </div>
            <div className="mt-4">
              <ChooseThumbnail
                label="Thumbnail"
                file={null}
                afterUpload={(ipfsUrl: string, thumbnailType: string) => {
                  if (ipfsUrl) {
                    setValue('thumbnail', ipfsUrl)
                    setValue('thumbnailType', thumbnailType)
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
              <RadioInput
                checked={watch('isAdultContent')}
                onChange={(checked) => {
                  setValue('isAdultContent', checked)
                }}
                question={
                  <span>
                    Do you want to restrict this stream to an{' '}
                    <span className="font-semibold">adult</span> audience?
                  </span>
                }
              />
            </div>
          </div>
          <div>
            <Preview stream={stream} />
            <StreamDetails stream={stream} />
          </div>
        </div>
        <div className="flex items-center justify-end">
          <span className="mt-4">
            <Button disabled={loading} type="submit">
              {buttonText}
            </Button>
          </span>
        </div>
      </form>
    </div>
  )
}

export default Studio
