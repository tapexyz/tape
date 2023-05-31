import Alert from '@components/Common/Alert'
import { Button } from '@components/UIElements/Button'
import InputMentions from '@components/UIElements/InputMentions'
import RadioInput from '@components/UIElements/RadioInput'
import { zodResolver } from '@hookform/resolvers/zod'
import useAppStore from '@lib/store'
import clsx from 'clsx'
import type { ReactNode } from 'react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { AiFillCloseCircle } from 'react-icons/ai'
import { z } from 'zod'
import Category from './Category'
import CollectModule from './CollectModule'
import Livestream from './Livestream'
import ReferenceModule from './ReferenceModule'

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
  livestreamName: z
    .string()
    .trim()
    .min(5, { message: 'Title should be at least 5 characters' })
    .max(100, { message: 'Title should not exceed 100 characters' }),
  description: z
    .string()
    .trim()
    .max(5000, { message: 'Description should not exceed 5000 characters' }),
  isSensitiveContent: z.boolean()
})

export type LivestreamVideoFormData = z.infer<typeof formSchema>

type Props = {
  onUpload: (data: LivestreamVideoFormData) => void
  onCancel: () => void
}

const Details: React.FC<Props> = ({ onUpload, onCancel }) => {
  const uploadedLivestream = useAppStore((state) => state.uploadedLivestream)

  const {
    handleSubmit,
    // getValues,
    formState: { errors },
    setValue,
    watch,
    clearErrors
  } = useForm<LivestreamVideoFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isSensitiveContent: uploadedLivestream.isSensitiveContent ?? false,
      livestreamName: uploadedLivestream.livestreamName,
      description: uploadedLivestream.description
    }
  })

  const onSubmitForm = (data: LivestreamVideoFormData) => {
    onUpload(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      <div className="grid h-full gap-5 md:grid-cols-2">
        <div className="flex flex-col justify-between">
          <div>
            <div className="relative pb-2">
              <h2>Create your livestream</h2>
            </div>
            <div className="relative">
              <InputMentions
                label="Livestream Name"
                placeholder="Title that describes your livestream"
                autoComplete="off"
                validationError={errors.livestreamName?.message}
                value={watch('livestreamName')}
                onContentChange={(value) => {
                  setValue('livestreamName', value)
                  clearErrors('livestreamName')
                }}
                mentionsSelector="input-mentions-single"
              />
              <div className="absolute right-1 top-0 mt-1 flex items-center justify-end">
                <span
                  className={clsx('text-[10px] opacity-50', {
                    'text-red-500 !opacity-100':
                      watch('livestreamName')?.length > 100
                  })}
                >
                  {watch('livestreamName')?.length}/100
                </span>
              </div>
            </div>
            <div className="relative mt-4">
              <InputMentions
                label="Description"
                placeholder="Describe more about your livestream, can be @channels, #hashtags or chapters (00:20 - Intro)"
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
              <div className="absolute right-1 top-0 mt-1 flex items-center justify-end">
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
          <Livestream />
        </div>
      </div>
      {uploadedLivestream.isNSFWThumbnail ? (
        <ContentAlert
          message={
            <span>
              Sorry! <b className="px-0.5">Selected thumbnail</b> image has
              tripped some content warnings. It contains NSFW content, choose
              different image to post.
            </span>
          }
        />
      ) : uploadedLivestream.isNSFW ? (
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
            loading={
              uploadedLivestream.loading ||
              uploadedLivestream.uploadingThumbnail
            }
            type="submit"
          >
            {uploadedLivestream.uploadingThumbnail
              ? 'Uploading thumbnail'
              : uploadedLivestream.buttonText}
          </Button>
        </div>
      )}
    </form>
  )
}

export default Details
