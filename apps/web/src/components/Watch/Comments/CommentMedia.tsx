import Modal from '@components/UIElements/Modal'
import { imageCdn, sanitizeDStorageUrl } from '@lenstube/generic'
import {
  type MediaSet,
  type Publication,
  PublicationMainFocus
} from '@lenstube/lens'
import type { FC } from 'react'
import React, { useState } from 'react'

import AudioComment from './AudioComment'
import VideoComment from './VideoComment'

type Props = {
  comment: Publication
}
const CommentMedia: FC<Props> = ({ comment }) => {
  const [imageSrc, setImageSrc] = useState('')
  const [showLighBox, setShowLighBox] = useState(false)

  const media: MediaSet[] = comment.metadata.media

  if (!media.length) {
    return null
  }

  const getIsVideoComment = () => {
    return comment.metadata.mainContentFocus === PublicationMainFocus.Video
  }

  const getIsAudioComment = () => {
    return comment.metadata.mainContentFocus === PublicationMainFocus.Audio
  }

  const getIsImageComment = () => {
    return comment.metadata.mainContentFocus === PublicationMainFocus.Image
  }

  return (
    <div className="my-2">
      <Modal
        show={showLighBox}
        panelClassName="!p-0 !rounded-none max-w-7xl !shadow-none !bg-transparent"
        onClose={() => setShowLighBox(false)}
      >
        <div
          role="button"
          tabIndex={0}
          onClick={() => setShowLighBox(false)}
          className="flex cursor-default justify-center"
        >
          <img
            src={imageSrc}
            className="object-contain"
            alt="attachment"
            draggable={false}
          />
        </div>
      </Modal>
      <div className="flex flex-wrap items-center gap-2">
        {media.map((media, i) =>
          getIsVideoComment() ? (
            <VideoComment key={i} comment={comment} />
          ) : getIsAudioComment() ? (
            <AudioComment key={i} media={media} />
          ) : getIsImageComment() ? (
            <button
              key={i}
              className="focus:outline-none"
              onClick={() => {
                setImageSrc(imageCdn(sanitizeDStorageUrl(media.original.url)))
                setShowLighBox(true)
              }}
            >
              <img
                className="h-20 w-20 rounded-xl bg-white object-cover dark:bg-black"
                src={imageCdn(
                  sanitizeDStorageUrl(media.original.url),
                  'AVATAR_LG'
                )}
                alt={media.original.altTag ?? 'attachment'}
                draggable={false}
              />
            </button>
          ) : null
        )}
      </div>
    </div>
  )
}

export default CommentMedia
