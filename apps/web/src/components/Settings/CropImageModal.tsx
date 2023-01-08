import 'react-image-crop/dist/ReactCrop.css'

import Modal from '@components/UIElements/Modal'
import type { FC } from 'react'
import React, { useRef, useState } from 'react'

type Props = {
  isModalOpen: boolean
  onClose?: () => void
  onPfpUpload: (file: File) => void
  getPreviewImageSrc: () => string
}
import { Button } from '@components/UIElements/Button'
import type { Crop } from 'react-image-crop'
import ReactCrop from 'react-image-crop'
import logger from 'utils/logger'

const CropImageModal: FC<Props> = ({
  isModalOpen,
  onClose,
  getPreviewImageSrc,
  onPfpUpload
}) => {
  const [crop, setCrop] = useState<Crop>()
  const imgRef = useRef<HTMLImageElement>(null)

  const getCroppedImg = async () => {
    try {
      const canvas = document.createElement('canvas')
      const image = imgRef.current as HTMLImageElement
      const cropped = crop as Crop
      const scaleX = image.naturalWidth / image?.width
      const scaleY = image.naturalHeight / image?.height
      canvas.width = cropped.width
      canvas.height = cropped.height
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
      ctx.drawImage(
        image,
        cropped.x * scaleX,
        cropped.y * scaleY,
        cropped.width * scaleX,
        cropped.height * scaleY,
        0,
        0,
        cropped.width,
        cropped.height
      )

      canvas.toBlob((blob) => {
        const file = new File([blob as Blob], 'fileName.jpg', {
          type: 'image/jpeg'
        })
        onPfpUpload(file)
      }, 'image/jpeg')
    } catch (e) {
      logger.error('[Error while crop image]', e)
    }
  }

  return (
    <Modal
      onClose={() => onClose?.()}
      show={isModalOpen}
      panelClassName="max-w-[80vh] h-auto"
      autoClose={false}
      title="Crop picture"
    >
      <div className="overflow-y-auto no-scrollbar text-center mt-2">
        <ReactCrop
          crop={crop}
          onChange={(c) => setCrop(c)}
          aspect={1}
          className="rounded-lg"
        >
          <img
            ref={imgRef}
            src={getPreviewImageSrc()}
            alt="profile image"
            className="h-80 object-fit"
          />
        </ReactCrop>
        <Button
          className="absolute bottom-0 right-0 flex mt-4 mr-2 mb-2 ml-auto"
          color="primary"
          onClick={getCroppedImg}
        >
          Crop & Save
        </Button>
      </div>
    </Modal>
  )
}

export default CropImageModal
