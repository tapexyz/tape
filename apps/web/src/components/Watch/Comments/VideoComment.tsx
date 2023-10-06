import { Trans } from '@lingui/macro'
import { STATIC_ASSETS, TAPE_APP_NAME } from '@tape.xyz/constants'
import type { Comment } from '@tape.xyz/lens'
import Link from 'next/link'
import type { FC } from 'react'
import React from 'react'

type Props = {
  comment: Comment
}

const VideoComment: FC<Props> = ({ comment }) => {
  return (
    <div className="my-2 rounded-xl border border-gray-300 px-4 py-3 dark:border-gray-700">
      <Link
        href={`/watch/${comment.id}`}
        className="flex items-center space-x-2.5"
        target="_blank"
      >
        <img
          src={`${STATIC_ASSETS}/brand/logo.svg`}
          className="h-5 w-5"
          draggable={false}
          alt={TAPE_APP_NAME}
        />
        <span>
          <Trans>Watch Video</Trans>
        </span>
      </Link>
    </div>
  )
}
export default VideoComment
