import type { AnyPublication } from '@tape.xyz/lens'
import type { FC } from 'react'

import { Dialog } from '@radix-ui/themes'
import {
  getPublication,
  getPublicationMediaUrl,
  imageCdn,
  sanitizeDStorageUrl
} from '@tape.xyz/generic'
import React, { useState } from 'react'

import AudioComment from './AudioComment'
import VideoComment from './VideoComment'

type Props = {
  comment: AnyPublication
}

const CommentMedia: FC<Props> = ({ comment }) => {
  const [imageSrc, setImageSrc] = useState('')
  const targetComment = getPublication(comment)

  const uri = getPublicationMediaUrl(targetComment.metadata)

  if (!uri.length) {
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
          <VideoComment commentId={targetComment.id} />
        ) : getIsAudioComment() ? (
          <AudioComment uri={uri} />
        ) : getIsImageComment() ? (
          <Dialog.Root>
            <Dialog.Trigger>
              <button
                className="focus:outline-none"
                onClick={() => {
                  setImageSrc(imageCdn(sanitizeDStorageUrl(uri)))
                }}
              >
                <img
                  alt={'attachment'}
                  className="size-20 rounded-xl bg-white object-cover dark:bg-black"
                  draggable={false}
                  src={imageCdn(sanitizeDStorageUrl(uri), 'AVATAR_LG')}
                />
              </button>
            </Dialog.Trigger>

            <Dialog.Content style={{ maxWidth: 650 }}>
              <img
                alt="attachment"
                className="object-contain"
                draggable={false}
                src={imageSrc}
              />
            </Dialog.Content>
          </Dialog.Root>
        ) : null}
      </div>
    </div>
  )
}

export default CommentMedia
