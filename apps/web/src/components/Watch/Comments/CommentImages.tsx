import Modal from '@components/UIElements/Modal'
import type { MediaSet } from 'lens'
import type { FC } from 'react'
import React, { useState } from 'react'
import imageCdn from 'utils/functions/imageCdn'
import sanitizeDStorageUrl from 'utils/functions/sanitizeDStorageUrl'

type Props = {
  images: MediaSet[]
}

const CommentImages: FC<Props> = ({ images }) => {
  const [imageSrc, setImageSrc] = useState('')
  const [showLighBox, setShowLighBox] = useState(false)

  if (!images.length) {
    return null
  }

  return (
    <div className="my-2">
      <Modal
        show={showLighBox}
        panelClassName="!p-0 !rounded-none !shadow-none !bg-transparent"
        onClose={() => setShowLighBox(false)}
      >
        <div
          role="button"
          onClick={() => setShowLighBox(false)}
          className="flex cursor-default justify-center"
        >
          <img src={imageSrc} alt="attachment" draggable={false} />
        </div>
      </Modal>
      <div className="flex flex-wrap items-center">
        {images.map((image) => (
          <button
            key={image.original.url}
            className="focus:outline-none"
            onClick={() => {
              setImageSrc(imageCdn(sanitizeDStorageUrl(image.original.url)))
              setShowLighBox(true)
            }}
          >
            <img
              className="h-20 w-20 rounded-xl object-cover"
              src={imageCdn(
                sanitizeDStorageUrl(image.original.url),
                'avatar_lg'
              )}
              alt={image.original.altTag ?? 'attachment'}
              draggable={false}
            />
          </button>
        ))}
      </div>
    </div>
  )
}

export default CommentImages
