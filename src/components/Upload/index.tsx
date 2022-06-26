import useAppStore from '@lib/store'

import DropZone from './DropZone'
import UploadSteps from './UploadSteps'

const UploadPage = () => {
  const { uploadedVideo } = useAppStore()

  return <>{uploadedVideo?.file ? <UploadSteps /> : <DropZone />}</>
}

export default UploadPage
