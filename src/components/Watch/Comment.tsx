import getProfilePicture from '@utils/functions/getProfilePicture'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import dynamic from 'next/dynamic'
import React, { FC } from 'react'
import { LenstubePublication } from 'src/types/local'
dayjs.extend(relativeTime)

const ImageAttachments = dynamic(() => import('../Common/ImageAttachments'))

interface Props {
  comment: LenstubePublication
  hideType?: boolean
}

const Comment: FC<Props> = ({ comment }) => {
  return (
    <div className="flex items-start w-full">
      <div className="flex-none mr-3">
        <img
          src={getProfilePicture(comment.profile)}
          className="w-8 h-8 rounded-xl"
          draggable={false}
          alt=""
        />
      </div>
      <div className="flex flex-col items-start mr-2">
        <span className="flex items-center mb-1 space-x-2">
          <h1 className="text-xs font-medium">{comment?.profile.handle}</h1>
          <span className="inline-flex items-center opacity-60 space-x-1 text-[10px]">
            {dayjs(new Date(comment?.createdAt)).fromNow()}
          </span>
        </span>
        <span className="text-sm">{comment?.metadata?.content}</span>
        <span className="mt-1">
          <ImageAttachments attachments={comment?.metadata?.media} />
        </span>
      </div>
    </div>
  )
}

export default Comment
