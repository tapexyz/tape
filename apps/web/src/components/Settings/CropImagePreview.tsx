import 'react-image-crop/dist/ReactCrop.css'

import { Button } from '@components/UIElements/Button'
import type { FC } from 'react'
import React, { useRef, useState } from 'react'
import type { Crop } from 'react-image-crop'
import ReactCrop from 'react-image-crop'
import { Analytics, TRACK } from 'utils'
import logger from 'utils/logger'

type Props = {
  onPfpUpload: (file: File) => void
  getPreviewImageSrc: () => string
}

const CropImagePreview: FC<Props> = ({ getPreviewImageSrc, onPfpUpload }) => {
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
        const file = new File([blob as Blob], 'nft.jpg', {
          type: 'image/jpeg'
        })
        Analytics.track(TRACK.PFP.UPLOAD_FROM_LOCAL)
        onPfpUpload(file)
      }, 'image/jpeg')
    } catch (e) {
      logger.error('[Error while crop image]', e)
    }
  }

  return (
    <div className="flex max-h-[90vh] flex-col justify-between text-center">
      <ReactCrop
        className="my-4 mx-auto max-h-[50vh]"
        crop={crop}
        onChange={(c) => setCrop(c)}
        aspect={1}
      >
        <img
          ref={imgRef}
          src={getPreviewImageSrc()}
          alt="profile image"
          className="object-fit h-auto"
        />
      </ReactCrop>
      <div className="flex justify-end">
        <Button color="primary" onClick={getCroppedImg}>
          Crop & Save
        </Button>
      </div>
    </div>
  )
}

export default CropImagePreview
