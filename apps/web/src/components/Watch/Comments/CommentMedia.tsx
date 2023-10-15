import { Dialog } from '@radix-ui/themes'
import {
  getPublication,
  getPublicationMediaUrl,
  imageCdn,
  sanitizeDStorageUrl
} from '@tape.xyz/generic'
import type { AnyPublication, Comment } from '@tape.xyz/lens'
import type { FC } from 'react'
import React, { useState } from 'react'

import AudioComment from './AudioComment'
import VideoComment from './VideoComment'

type Props = {
  comment: AnyPublication
}

const CommentMedia: FC<Props> = ({ comment }) => {
  const [imageSrc, setImageSrc] = useState('')
  const targetComment = getPublication(comment)

  const media = getPublicationMediaUrl(targetComment.metadata)

  if (!media.length) {
    return null
  }

  const getIsVideoComment = () => {
    return targetComment.metadata.__typename === 'VideoMetadataV3'
  }

  const getIsAudioComment = () => {
    return targetComment.metadata.__typename === 'AudioMetadataV3'
  }

  const getIsImageComment = () => {
    return targetComment.metadata.__typename === 'ImageMetadataV3'
  }

  return (
    <div className="my-2">
      <div className="flex flex-wrap items-center gap-2">
        {getIsVideoComment() ? (
          <VideoComment comment={targetComment as Comment} />
        ) : getIsAudioComment() ? (
          <AudioComment media={media} />
        ) : getIsImageComment() ? (
          <Dialog.Root>
            <Dialog.Trigger>
              <button
                className="focus:outline-none"
                onClick={() => {
                  setImageSrc(imageCdn(sanitizeDStorageUrl(media)))
                }}
              >
                <img
                  className="h-20 w-20 rounded-xl bg-white object-cover dark:bg-black"
                  src={imageCdn(sanitizeDStorageUrl(media), 'AVATAR_LG')}
                  alt={'attachment'}
                  draggable={false}
                />
              </button>
            </Dialog.Trigger>

            <Dialog.Content style={{ maxWidth: 650 }}>
              <img
                src={imageSrc}
                className="object-contain"
                alt="attachment"
                draggable={false}
              />
            </Dialog.Content>
          </Dialog.Root>
        ) : null}
      </div>
    </div>
  )
}

export default CommentMedia
