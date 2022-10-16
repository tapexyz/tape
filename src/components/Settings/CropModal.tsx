import { Button } from '@components/UIElements/Button'
import Modal from '@components/UIElements/Modal'
import Slider from '@material-ui/core/Slider'
import React, { FC } from 'react'
import Cropper from 'react-easy-crop'

type Props = {
  show: boolean
  setShowCrop: React.Dispatch<boolean>
  zoom: number
  setZoom: React.Dispatch<number>
  crop: { x: number; y: number }
  setCrop: React.Dispatch<{ x: number; y: number }>
  onCropComplete: (croppedArea: any, croppedAreaPixels: any) => void
  imageSrc: string | null
  rotation: number
  setRotation: React.Dispatch<number>
  selectCroppedImage: () => void
}

const CropModal: FC<Props> = ({
  show,
  setShowCrop,
  zoom,
  setZoom,
  crop,
  setCrop,
  onCropComplete,
  imageSrc,
  rotation,
  setRotation,
  selectCroppedImage
}) => {
  return (
    <Modal
      title="Crop Channel Picture"
      onClose={() => setShowCrop(false)}
      show={show}
      panelClassName="w-1/2 h-3/4"
    >
      <div className="relative h-3/4">
        <div className="flex">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={1 / 1}
            onCropChange={setCrop}
            onRotationChange={setRotation}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            cropShape="round"
            objectFit="auto-cover"
          />
        </div>
      </div>
      <div className="flex flex-col h-10 mt-4 ml-auto">
        Zoom
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
        />
        <Button
          className="w-32 h-10 p-4"
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
