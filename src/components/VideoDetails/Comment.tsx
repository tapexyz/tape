import getProfilePicture from '@utils/functions/getProfilePicture'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import dynamic from 'next/dynamic'
import React, { FC } from 'react'
import { LenstubePublication } from 'src/types/local'
dayjs.extend(relativeTime)

const ImageAttachments = dynamic(() => import('../common/ImageAttachments'))

interface Props {
  video: LenstubePublication
  hideType?: boolean
}

const Comment: FC<Props> = ({ video }) => {
  return (
    <div className="flex items-start w-full">
      <a className="flex-none mr-3">
        <img
          src={getProfilePicture(video.profile)}
          className="w-8 h-8 border-2 rounded-full"
          draggable={false}
          alt=""
        />
      </a>
      <div className="flex flex-col items-start mr-2">
        <span className="flex items-center space-x-2">
          <h1 className="text-xs font-medium">{video?.profile.handle}</h1>
          <span className="inline-flex items-center opacity-60 space-x-1 text-[10px]">
            {dayjs(new Date(video?.createdAt)).fromNow()}
          </span>
        </span>
        <span className="text-sm">{video?.metadata?.content}</span>
        <span className="mt-1">
          <ImageAttachments attachments={video?.metadata?.media} />
        </span>
      </div>
    </div>
  )
}

export default Comment
