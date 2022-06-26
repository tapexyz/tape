import { Input } from '@components/UIElements/Input'
import RadioInput from '@components/UIElements/RadioInput'
import clsx from 'clsx'
import React, { FC } from 'react'
import {
  IPFSUploadResult,
  UploadedVideo,
  VideoUploadForm
} from 'src/types/local'

import ChooseThumbnail from './ChooseThumbnail'

type Props = {
  videoMeta: VideoUploadForm
  video: UploadedVideo
  setVideoMeta: React.Dispatch<VideoUploadForm>
  // eslint-disable-next-line no-unused-vars
  onThumbnailUpload: (data: IPFSUploadResult | null) => void
}

const Form: FC<Props> = ({
  videoMeta,
  video,
  setVideoMeta,
  onThumbnailUpload
}) => {
  return (
    <div>
      <div>
        <div className="flex items-center justify-between mb-1 space-x-1.5">
          <div className="required text-[11px] font-semibold uppercase opacity-70">
            Title
          </div>
          <span
            className={clsx('text-[10px] opacity-50', {
              'text-red-500 !opacity-100': videoMeta.title.length > 100
            })}
          >
            {videoMeta.title.length}/100
          </span>
        </div>
        <Input
          type="text"
          placeholder="Title that describes your video"
          autoComplete="off"
          value={videoMeta.title}
          autoFocus
          onChange={(e) =>
            setVideoMeta({ ...videoMeta, title: e.target.value })
          }
        />
      </div>
      <div className="mt-4">
        <div className="flex items-center justify-between mb-1 space-x-1.5">
          <div className="text-[11px] font-semibold uppercase opacity-70">
            Description
          </div>
          <span
            className={clsx('text-[10px] opacity-50', {
              'text-red-500 !opacity-100': videoMeta.description.length > 5000
            })}
          >
            {videoMeta.description.length}/5000
          </span>
        </div>
        <textarea
          placeholder="More about your video"
          autoComplete="off"
          rows={5}
          className={clsx(
            'bg-white text-sm px-2.5 py-1 rounded-xl focus:ring-1 focus:ring-indigo-500 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 disabled:opacity-60 disabled:bg-gray-500 disabled:bg-opacity-20 outline-none w-full'
          )}
          value={videoMeta.description}
          onChange={(e) =>
            setVideoMeta({ ...videoMeta, description: e.target.value })
          }
        />
      </div>
      <div className="mt-4">
        <ChooseThumbnail
          label="Thumbnail"
          file={video.file}
          afterUpload={(data: IPFSUploadResult | null) => {
            onThumbnailUpload(data)
          }}
        />
      </div>
      <div className="mt-4">
        <RadioInput
          checked={videoMeta.adultContent}
          onChange={(checked) => {
            setVideoMeta({ ...videoMeta, adultContent: checked })
          }}
          question={
            <span>
              Do you want to restrict this video to an <b>adult</b> audience?
            </span>
          }
        />
      </div>
    </div>
  )
}

export default Form
