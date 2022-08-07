import { Loader } from '@components/UIElements/Loader'
import useAppStore from '@lib/store'
import dynamic from 'next/dynamic'

const DropZone = dynamic(() => import('./DropZone'))
const UploadSteps = dynamic(() => import('./UploadSteps'), {
  loading: () => (
    <div className="py-20">
      <Loader />
    </div>
  )
})

const UploadPage = () => {
  const uploadedVideo = useAppStore((state) => state.uploadedVideo)

  return uploadedVideo?.file ? <UploadSteps /> : <DropZone />
}

export default UploadPage
