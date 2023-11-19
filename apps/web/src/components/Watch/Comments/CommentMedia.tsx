import {
  getPublication,
  getPublicationMediaUrl,
  imageCdn,
  sanitizeDStorageUrl
} from '@dragverse/generic'
import type { AnyPublication } from '@dragverse/lens'
import { Dialog } from '@radix-ui/themes'
import type { FC } from 'react'
import { useState } from 'react'

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
                  className="h-20 w-20 rounded-xl bg-white object-cover dark:bg-black"
                  src={imageCdn(sanitizeDStorageUrl(uri), 'AVATAR_LG')}
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
