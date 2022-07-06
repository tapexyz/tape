import { Button } from '@components/UIElements/Button'
import { Input } from '@components/UIElements/Input'
import { TextArea } from '@components/UIElements/TextArea'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
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
  isAdultContent: z.boolean()
})
export type VideoFormData = z.infer<typeof formSchema>

const Details = () => {
  const [buttonText, setButtonText] = useState('Create')
  const {
    register,
    formState: { errors }
  } = useForm<VideoFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isAdultContent: false
    }
  })

  return (
    <div className="h-full">
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

          <StreamDetails />
        </div>
        <div>
          <Preview />
        </div>
      </div>
      <div className="flex items-center justify-end">
        <span className="mt-4">
          <Button
            onClick={() => {
              setButtonText('Creating...')
            }}
          >
            {buttonText}
          </Button>
        </span>
      </div>
    </div>
  )
}

export default Details
