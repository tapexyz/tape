import type { FC } from 'react'

import { STATIC_ASSETS, TAPE_APP_NAME } from '@tape.xyz/constants'
import Link from 'next/link'
import React from 'react'

type Props = {
  commentId: string
}

const VideoComment: FC<Props> = ({ commentId }) => {
  return (
    <div className="my-2 rounded-xl border border-gray-300 px-4 py-3 dark:border-gray-700">
      <Link
        className="flex items-center space-x-2.5"
        href={`/watch/${commentId}`}
        target="_blank"
      >
        <img
          alt={TAPE_APP_NAME}
          className="size-5"
          draggable={false}
          src={`${STATIC_ASSETS}/brand/logo.svg`}
        />
        <span>Watch Video</span>
      </Link>
    </div>
  )
}
export default VideoComment
