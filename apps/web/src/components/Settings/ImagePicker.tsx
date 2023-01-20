import Modal from '@components/UIElements/Modal'
import type { Profile } from 'lens'
import type { ChangeEvent, FC } from 'react'
import React, { useState } from 'react'

import ChoosePicture from './ChoosePicture'
import CropImagePreview from './CropImagePreview'

type Props = {
  show: boolean
  onClose?: () => void
  channel: Profile
  setNFTAvatar: (
    contractAddress: string,
    tokenId: string,
    chainId: number
  ) => void
  onPfpUpload: (file: File) => void
}

const ImagePicker: FC<Props> = ({
  show,
  onClose,
  channel,
  setNFTAvatar,
  onPfpUpload
}) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)

  const onChooseImage = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setSelectedImage(e.target.files[0])
    }
  }

  const getPreviewImageSrc = (): string => {
    return selectedImage ? URL.createObjectURL(selectedImage as File) : ''
  }

  return (
    <Modal
      onClose={() => {
        setSelectedImage(null)
        onClose?.()
      }}
      show={show}
      panelClassName="max-w-lg no-scrollbar"
      autoClose={false}
      title="Select picture"
    >
      {selectedImage ? (
        <CropImagePreview
          getPreviewImageSrc={getPreviewImageSrc}
          onPfpUpload={onPfpUpload}
        />
      ) : (
        <ChoosePicture
          channel={channel}
          onChooseImage={onChooseImage}
          setNFTAvatar={setNFTAvatar}
        />
      )}
    </Modal>
  )
}

export default ImagePicker
