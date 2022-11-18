import useAppStore from '@lib/store'
import React from 'react'

import DropZone from './DropZone'
import UploadSteps from './UploadSteps'

const UploadPage = () => {
  const uploadedVideo = useAppStore((state) => state.uploadedVideo)

  return uploadedVideo?.file ? <UploadSteps /> : <DropZone />
}

export default UploadPage
