import useAppStore from '@lib/store'
import dynamic from 'next/dynamic'

const DropZone = dynamic(() => import('./DropZone'))
const UploadSteps = dynamic(() => import('./UploadSteps'))

const UploadPage = () => {
  const { uploadedVideo } = useAppStore()

  return <>{uploadedVideo?.file ? <UploadSteps /> : <DropZone />}</>
}

export default UploadPage
