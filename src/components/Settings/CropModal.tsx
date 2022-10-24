import 'react-image-crop/dist/ReactCrop.css'

import { Button } from '@components/UIElements/Button'
import Modal from '@components/UIElements/Modal'
import { useDebounceEffect } from '@utils/hooks/useDebounceEffect'
import React, { FC } from 'react'
import ReactCrop, {
  centerCrop,
  Crop,
  makeAspectCrop,
  PixelCrop
} from 'react-image-crop'

import { canvasPreview } from '../../utils/functions/canvasPreview'

type Props = {
  show: boolean
  setShowCrop: React.Dispatch<boolean>
  crop: Crop
  setCrop: React.Dispatch<{
    x: number
    y: number
    width: number
    height: number
    unit: 'px' | '%'
  }>
  setCompletedCrop: (crop: PixelCrop) => void
  imgRef: React.RefObject<HTMLImageElement>
  imgSrc: string
  previewCanvasRef: React.RefObject<HTMLCanvasElement>
  // aspect: number
  // scale: number
  // rotate: number
  completedCrop: PixelCrop
  selectCroppedImage: () => void
}

const CropModal: FC<Props> = ({
  show,
  setShowCrop,
  crop,
  setCrop,
  setCompletedCrop,
  imgRef,
  imgSrc,
  // aspect,
  // scale,
  // rotate,
  completedCrop,
  previewCanvasRef,
  selectCroppedImage
}) => {
  // This is to demonstrate how to make and center a % aspect crop
  // which is a bit trickier so we use some helper functions.
  const centerAspectCrop = (
    mediaWidth: number,
    mediaHeight: number,
    aspect: number = 1
  ) => {
    return centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 50
        },
        aspect,
        mediaWidth,
        mediaHeight
      ),
      mediaWidth,
      mediaHeight
    )
  }
  // set values
  const scale = 1
  const rotate = 0
  const aspect = 1
  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (aspect) {
      const { width, height } = e.currentTarget
      setCrop(centerAspectCrop(width, height, aspect))
    }
  }
  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        // We use canvasPreview as it's much faster than imgPreview.
        canvasPreview(
          imgRef.current,
          previewCanvasRef.current,
          completedCrop,
          scale,
          rotate
        )
      }
    },
    100,
    [completedCrop, scale, rotate]
  )
  return (
    <Modal
      title="Crop Channel Picture"
      onClose={() => setShowCrop(false)}
      show={show}
      panelClassName="max-w-[50vh]"
    >
      <div className="max-h-[80vh] overflow-y-auto no-scrollbar">
        <ReactCrop
          circularCrop={false}
          crop={crop}
          onChange={(_, percentCrop) => setCrop(percentCrop)}
          onComplete={(c) => setCompletedCrop(c)}
          aspect={aspect}
        >
          <img
            ref={imgRef}
            alt="Crop me"
            src={imgSrc}
            style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
            onLoad={onImageLoad}
          />
        </ReactCrop>
        <canvas
          hidden={true}
          ref={previewCanvasRef}
          className={'relative translate-x-1/2 translate-y-4'}
          style={{
            border: '1px solid black',
            objectFit: 'contain',
            width: '50%',
            height: '50%'
          }}
        />
        <Button
          className="absolute bottom-0 right-0 flex h-10 mt-4 ml-auto"
          onClick={selectCroppedImage}
          color="primary"
        >
          Crop
        </Button>
      </div>
    </Modal>
  )
}
export default CropModal
