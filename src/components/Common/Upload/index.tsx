import { Loader } from '@components/UIElements/Loader'
import Modal from '@components/UIElements/Modal'
import useAppStore from '@lib/store'
import clsx from 'clsx'
import dynamic from 'next/dynamic'
import React, { useState } from 'react'
import { FileRejection, useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'
import { FiUpload } from 'react-icons/fi'
import { VideoUpload } from 'src/types/local'

const Details = dynamic(() => import('./Details'), {
  loading: () => (
    <div className="p-10 md:py-20">
      <Loader />
    </div>
  )
})

const Upload = () => {
  const [video, setVideo] = useState<VideoUpload>({
    buffer: null,
    preview: '',
    videoType: '',
    file: null
  })
  const { showUploadVideoModal, setShowUploadVideoModal } = useAppStore()

  const uploadVideo = async (files: File[]) => {
    const file = files[0]
    try {
      if (file) {
        const preview = URL.createObjectURL(file)
        setVideo({ ...video, preview })
        let reader = new FileReader()
        reader.onload = function () {
          if (reader.result) {
            let buffer = Buffer.from(reader.result as string)
            setVideo({ ...video, buffer, preview, videoType: file.type, file })
          }
        }
        reader.readAsArrayBuffer(file)
      }
    } catch (error) {
      toast.error('Error uploading file!')
    }
  }

  const onCloseUploadModal = () => {
    setShowUploadVideoModal(false)
    setVideo({ preview: '', buffer: null, videoType: '', file: null })
  }

  const onDropRejected = (fileRejections: FileRejection[]) => {
    fileRejections[0].errors.forEach((error) => toast.error(error.message))
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: uploadVideo,
    onDropRejected,
    accept: {
      'video/*': ['.mp4', '.mov', '.mpg', '.avi', '.mpeg']
    },
    maxFiles: 1,
    maxSize: 2147483648 // 2 GB
  })

  return (
    <Modal
      onClose={() => onCloseUploadModal()}
      show={showUploadVideoModal}
      panelClassName="max-w-4xl !p-4 max-h-[80vh]"
      preventAutoClose={true}
      title="Upload Video"
    >
      <div className="min-h-[20vh] mt-4">
        {video.preview ? (
          <Details video={video} closeUploadModal={onCloseUploadModal} />
        ) : (
          <div
            {...getRootProps()}
            className={clsx(
              'p-10 md:py-20 h-full focus:outline-none border-gray-300 dark:border-gray-700 grid place-items-center text-center border-2 border-dashed rounded-lg cursor-pointer'
            )}
          >
            <div>
              <span className="flex justify-center mb-6 text-4xl opacity-60">
                <FiUpload />
              </span>
              <input {...getInputProps()} />
              <span className="opacity-80">
                {isDragActive ? (
                  <p>Drop it here</p>
                ) : (
                  <div>
                    <p>Drag and drop your video</p>
                    <span className="text-sm">(Maximum size 2 GB for now)</span>
                  </div>
                )}
              </span>
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}

export default Upload
