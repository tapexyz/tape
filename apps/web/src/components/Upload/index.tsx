import usePersistStore from '@lib/store/persist'
import React from 'react'

import DropZone from './DropZone'
import UploadSteps from './UploadSteps'

const UploadPage = () => {
  const uploadedVideo = usePersistStore((state) => state.uploadedVideo)

  return uploadedVideo?.file ? <UploadSteps /> : <DropZone />
}

export default UploadPage
