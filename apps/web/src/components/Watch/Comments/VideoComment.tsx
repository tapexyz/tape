import type { Publication } from 'lens'
import Link from 'next/link'
import type { FC } from 'react'
import React from 'react'
import { STATIC_ASSETS } from 'utils'

type Props = {
  comment: Publication
}

const VideoComment: FC<Props> = ({ comment }) => {
  return (
    <div className="my-2 rounded-xl border border-gray-200 px-4 py-3 dark:border-gray-800">
      <Link
        href={`/watch/${comment.id}`}
        className="flex items-center space-x-2.5"
      >
        <img
          src={`${STATIC_ASSETS}/images/brand/circle-72x72.png`}
          className="h-5 w-5"
          draggable={false}
          alt="lenstube"
        />
        <span>Watch Video</span>
      </Link>
    </div>
  )
}
export default VideoComment
