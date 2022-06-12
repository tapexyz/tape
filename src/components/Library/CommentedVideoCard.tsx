import getProfilePicture from '@utils/functions/getProfilePicture'
import getThumbnailUrl from '@utils/functions/getThumbnailUrl'
import imageCdn from '@utils/functions/imageCdn'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Link from 'next/link'
import React, { FC } from 'react'
import { LenstubePublication } from 'src/types/local'
dayjs.extend(relativeTime)

type Props = {
  comment: LenstubePublication
}

const CommentedVideoCard: FC<Props> = ({ comment }) => {
  const commentedOn = comment.commentOn as LenstubePublication

  return (
    <Link href={`/watch/${commentedOn.pubId}`} passHref>
      <div className="overflow-hidden rounded-lg cursor-pointer group bg-secondary">
        <div className="rounded-t-lg aspect-w-16 aspect-h-7">
          <img
            src={imageCdn(getThumbnailUrl(commentedOn))}
            alt=""
            draggable={false}
            className="object-cover object-center w-full h-full rounded-t-lg lg:w-full lg:h-full"
          />
        </div>
        <div className="p-2">
          <div className="flex items-start space-x-2.5">
            <div className="flex-none mt-0.5">
              <img
                className="w-8 h-8 rounded-full"
                src={imageCdn(getProfilePicture(comment.profile))}
                alt=""
                draggable={false}
              />
            </div>
            <div className="flex flex-col items-start flex-1">
              <div className="flex w-full items-start justify-between space-x-1.5">
                <h3 className="font-medium text-[15px] line-clamp-2 opacity-80">
                  {commentedOn.metadata?.name}
                </h3>
              </div>
              <Link href={`/${comment.profile?.handle}`}>
                <a className="text-xs hover:opacity-100 opacity-70">
                  {comment.profile?.handle}
                </a>
              </Link>
            </div>
          </div>
          <div className="relative pt-2 overflow-hidden text-sm opacity-90">
            <div className="absolute left-2.5 pb-1 inset-0 flex justify-center w-1.5">
              <div className="w-0.5 bg-gray-300 dark:bg-gray-700 pointer-events-none" />
            </div>
            <div className="pl-7">
              <span className="text-sm line-clamp-1">
                {comment.metadata.content}
              </span>
              <div className="flex items-center text-[10px] opacity-70">
                <span>{dayjs(new Date(commentedOn.createdAt)).fromNow()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default CommentedVideoCard
