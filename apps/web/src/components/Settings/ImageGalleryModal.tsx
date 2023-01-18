import Modal from '@components/UIElements/Modal'
import type { Profile } from 'lens'
import type { ChangeEvent, FC } from 'react'
import React from 'react'

import ChoosePicture from './ChoosePicture'
import CropImagePreview from './CropImagePreview'

type Props = {
  isModalOpen: boolean
  onClose?: () => void
  onChooseImage?: (e: ChangeEvent<HTMLInputElement>) => void
  channel: Profile
  setNFTAvatar: (
    contractAddress: string,
    tokenId: string,
    chainId: number
  ) => void
  onPfpUpload: (file: File) => void
  getPreviewImageSrc: () => string
  showCropImagePreview: boolean
}

const ImageGalleryModal: FC<Props> = ({
  isModalOpen,
  onClose,
  onChooseImage,
  channel,
  setNFTAvatar,
  onPfpUpload,
  getPreviewImageSrc,
  showCropImagePreview
}) => {
  return (
    <Modal
      onClose={() => onClose?.()}
      show={isModalOpen}
      panelClassName="max-w-lg h-[75vh] no-scrollbar"
      autoClose={false}
      title={showCropImagePreview && 'Crop picture'}
    >
      {!showCropImagePreview ? (
        <ChoosePicture
          onChooseImage={onChooseImage}
          setNFTAvatar={setNFTAvatar}
          channel={channel}
        />
      ) : (
        <CropImagePreview
          getPreviewImageSrc={getPreviewImageSrc}
          onPfpUpload={onPfpUpload}
        />
      )}
    </Modal>
  )
}

export default ImageGalleryModal
