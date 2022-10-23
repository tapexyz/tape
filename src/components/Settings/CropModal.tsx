import { Button } from '@components/UIElements/Button'
import Modal from '@components/UIElements/Modal'
import Slider from '@material-ui/core/Slider'
import React, { FC } from 'react'
// react-image-crop
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
  PixelCrop,
  PercentCrop
} from 'react-image-crop'
import useDebounce from '@utils/hooks/useDebounce'
import { canvasPreview } from './canvasPreview'
import { useDebounceEffect } from '@utils/hooks/useDebounceEffect'

import 'react-image-crop/dist/ReactCrop.css'

type Props = {
  show: boolean
  setShowCrop: React.Dispatch<boolean>
  // zoom: number
  // setZoom: React.Dispatch<number>
  // crop: { x: number; y: number; width: number; height: number; unit: number }
  // setCrop: React.Dispatch<{
  //   x: number
  //   y: number
  //   width: number
  //   height: number
  //   unit: number
  // }>
  crop: {
    x: number
    y: number
    width: number
    height: number
    unit: 'px' | '%'
  }
  setCrop: React.Dispatch<{
    x: number
    y: number
    width: number
    height: number
    unit: 'px' | '%'
  }>
  setCompletedCrop: (crop: PixelCrop) => void
  aspect: number
  imgRef: React.RefObject<HTMLImageElement>
  imgSrc: string
  previewCanvasRef: React.RefObject<HTMLCanvasElement>
  scale: number
  rotate: number
  completedCrop: PixelCrop
  selectCroppedImage: () => void

  // onCropComplete: (croppedArea: any, croppedAreaPixels: any) => void
  // imageSrc: string | undefined
  // rotation: number
  // setRotation: React.Dispatch<number>
  // selectCroppedImage: () => void
}

const CropModal: FC<Props> = ({
  show,
  setShowCrop,
  // zoom,
  // setZoom,
  crop,
  setCrop,
  setCompletedCrop,
  aspect,
  imgRef,
  imgSrc,
  scale,
  rotate,
  completedCrop,
  previewCanvasRef,
  selectCroppedImage
  // onCropComplete,
  // imageSrc,
  // rotation,
  // setRotation,
  // selectCroppedImage
}) => {
  // This is to demonstate how to make and center a % aspect crop
  // which is a bit trickier so we use some helper functions.
  const centerAspectCrop = (
    mediaWidth: number,
    mediaHeight: number,
    aspect: number
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
      panelClassName="w-1/2 h-3/4"
    >
      {/* <div className="relative h-3/4"> */}
      <div className="flex-row">
        <ReactCrop
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
        <div>
          <div>Image crop</div>
          {/* {!!completedCrop && ( */}
          <canvas
            ref={previewCanvasRef}
            style={{
              border: '1px solid black',
              objectFit: 'contain',
              width: completedCrop?.width | 0,
              height: completedCrop?.height | 0
            }}
          />
          {/* )} */}
        </div>
        {/* </div> */}
      </div>
      {/* <div className="flex flex-col h-10 mt-4 ml-auto"> */}
      {/* Zoom
        <Slider
          value={zoom}
          min={1}
          max={3}
          step={0.1}
          aria-labelledby="Zoom"
          onChange={(e, zoom) => setZoom(Number(zoom))}
          classes={{ root: 'slider' }}
        />
        Rotate
        <Slider
          value={rotation}
          min={0}
          max={360}
          step={1}
          aria-labelledby="Rotation"
          onChange={(e, rotation) => setRotation(Number(rotation))}
        /> */}
      <Button
        className="w-32 h-10 p-4"
        onClick={selectCroppedImage}
        color="primary"
      >
        Crop
      </Button>
      {/* </div> */}
    </Modal>
  )
}
export default CropModal
