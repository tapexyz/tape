import {
    getPublication,
    getPublicationMediaUrl,
    imageCdn,
    sanitizeDStorageUrl
} from '@dragverse/generic';
import type { AnyPublication } from '@dragverse/lens';
import { Modal } from '@dragverse/ui';
import type { FC } from 'react';
import { useState } from 'react';

import AudioComment from './AudioComment';
import VideoComment from './VideoComment';

type Props = {
  comment: AnyPublication
}

const CommentMedia: FC<Props> = ({ comment }) => {
  const [imageSrc, setImageSrc] = useState('')
  const [showModal, setShowModal] = useState(false)
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
          <>
            <button
              className="size-20 overflow-hidden focus:outline-none"
              onClick={() => {
                setImageSrc(imageCdn(sanitizeDStorageUrl(uri)))
                setShowModal(true)
              }}
            >
              <img
                className="size-20 rounded-xl bg-white object-cover dark:bg-brand-850"
                src={imageCdn(sanitizeDStorageUrl(uri), 'AVATAR_LG')}
                alt={'attachment'}
                draggable={false}
              />
            </button>

            <Modal title="Preview" show={showModal} setShow={setShowModal}>
              <img
                src={imageSrc}
                className="h-full w-full rounded object-contain"
                alt="attachment"
                draggable={false}
              />
            </Modal>
          </>
        ) : null}
      </div>
    </div>
  )
}

export default CommentMedia
