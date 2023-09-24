import Modal from '@components/UIElements/Modal'
import {
  getPublication,
  getPublicationMediaUrl,
  imageCdn,
  sanitizeDStorageUrl
} from '@lenstube/generic'
import type { AnyPublication, Comment } from '@lenstube/lens'
import type { FC } from 'react'
import React, { useState } from 'react'

import AudioComment from './AudioComment'
import VideoComment from './VideoComment'

type Props = {
  comment: AnyPublication
}

const CommentMedia: FC<Props> = ({ comment }) => {
  const [imageSrc, setImageSrc] = useState('')
  const [showLighBox, setShowLighBox] = useState(false)

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
        {getIsVideoComment() ? (
          <VideoComment comment={targetComment as Comment} />
        ) : getIsAudioComment() ? (
          <AudioComment media={media} />
        ) : getIsImageComment() ? (
          <button
            className="focus:outline-none"
            onClick={() => {
              setImageSrc(imageCdn(sanitizeDStorageUrl(media)))
              setShowLighBox(true)
            }}
          >
            <img
              className="h-20 w-20 rounded-xl bg-white object-cover dark:bg-black"
              src={imageCdn(sanitizeDStorageUrl(media), 'AVATAR_LG')}
              alt={'attachment'}
              draggable={false}
            />
          </button>
        ) : null}
      </div>
    </div>
  )
}

export default CommentMedia
