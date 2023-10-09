import EmojiPicker from '@components/UIElements/EmojiPicker'
import InputMentions from '@components/UIElements/InputMentions'
import { Toggle } from '@components/UIElements/Toggle'
import Tooltip from '@components/UIElements/Tooltip'
import { zodResolver } from '@hookform/resolvers/zod'
import useAppStore from '@lib/store'
import { t, Trans } from '@lingui/macro'
import { Button, Flex, RadioGroup, Text } from '@radix-ui/themes'
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
import ReferenceModule from './ReferenceModule'
import Video from './Video'

const formSchema = object({
  title: string()
    .trim()
    .min(5, { message: t`Title should be atleast 5 characters` })
    .max(100, { message: t`Title should not exceed 100 characters` }),
  description: string()
    .trim()
    .min(5, { message: t`Description should be atleast 5 characters` })
    .max(5000, { message: t`Description should not exceed 5000 characters` }),
  isSensitiveContent: boolean()
})

export type VideoFormData = z.infer<typeof formSchema>

type Props = {
  onUpload: (data: VideoFormData) => void
  onCancel: () => void
}

const Details: FC<Props> = ({ onUpload, onCancel }) => {
  const uploadedVideo = useAppStore((state) => state.uploadedVideo)
  const setUploadedVideo = useAppStore((state) => state.setUploadedVideo)

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
    if (!uploadedVideo.thumbnail?.length) {
      return toast.error(t`Please select or upload a thumbnail`)
    }
    onUpload(data)
  }

  const toggleUploadAsByte = (enable: boolean) => {
    if (isByteSizeVideo && enable) {
      return setUploadedVideo({ isByteVideo: true })
    } else {
      setUploadedVideo({ isByteVideo: false })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      <div className="grid h-full gap-5 md:grid-cols-2">
        <div className="flex flex-col justify-between">
          <div>
            <div className="relative">
              <InputMentions
                label={t`Title`}
                placeholder={t`Title that describes your content`}
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
                label={t`Description`}
                placeholder={t`Describe more about your content, can also be @profile, #hashtags or chapters (00:20 - Intro)`}
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
              <div className="absolute right-1 top-0 mt-1 flex items-center justify-end">
                <span
                  className={clsx(
                    'text-[10px]',
                    watch('description')?.length > 5000
                      ? 'text-red-500'
                      : 'opacity-50'
                  )}
                >
                  {watch('description')?.length}/5000
                </span>
              </div>
            </div>
            <Tooltip
              visible={!isByteSizeVideo}
              content={t`Please note that only videos under 2 minutes in length can be uploaded as bytes.`}
            >
              <div
                className={clsx(
                  'mt-2',
                  !isByteSizeVideo && 'cursor-not-allowed opacity-50'
                )}
              >
                <Toggle
                  label={t`Upload this video as short-form bytes`}
                  enabled={Boolean(uploadedVideo.isByteVideo)}
                  setEnabled={(b) => toggleUploadAsByte(b)}
                  size="sm"
                  disabled={!isByteSizeVideo}
                />
              </div>
            </Tooltip>
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
              <span>
                <Trans>
                  Does this media content contain sensitive information that may
                  not be suitable for a general audience?
                </Trans>
              </span>
              <RadioGroup.Root
                mt="2"
                defaultValue="NO"
                highContrast
                value={watch('isSensitiveContent') ? 'YES' : 'NO'}
                onValueChange={(value) =>
                  setValue('isSensitiveContent', value === 'YES')
                }
              >
                <Flex gap="2" direction="column">
                  <label>
                    <Flex gap="2" align="center">
                      <RadioGroup.Item value="YES" />
                      <Text size="2">Yes</Text>
                    </Flex>
                  </label>
                  <label>
                    <Flex gap="2" align="center">
                      <RadioGroup.Item value="NO" />
                      <Text size="2">No</Text>
                    </Flex>
                  </label>
                </Flex>
              </RadioGroup.Root>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-start justify-between">
          <Video />
        </div>
      </div>
      <div className="mt-4 flex items-center justify-end space-x-2">
        <Button
          color="gray"
          variant="soft"
          disabled={uploadedVideo.loading}
          onClick={() => onCancel()}
        >
          <Trans>Reset</Trans>
        </Button>
        <Button
          highContrast
          disabled={uploadedVideo.loading || uploadedVideo.uploadingThumbnail}
          type="submit"
        >
          {uploadedVideo.uploadingThumbnail
            ? t`Uploading thumbnail`
            : uploadedVideo.buttonText}
        </Button>
      </div>
    </form>
  )
}

export default Details
