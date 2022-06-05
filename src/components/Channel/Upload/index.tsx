import Modal from '@components/UIElements/Modal'
import useAppStore from '@lib/store'
import clsx from 'clsx'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { FileRejection, useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'
import { FiUpload } from 'react-icons/fi'
import { MdOutlineClose } from 'react-icons/md'
import { VideoUpload } from 'src/types/local'

const Details = dynamic(() => import('./Details'))

const Upload = () => {
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [video, setVideo] = useState<VideoUpload>({
    buffer: null,
    preview: '',
    videoType: ''
  })
  const { selectedChannel } = useAppStore()

  const {
    query: { upload },
    push
  } = useRouter()

  useEffect(() => {
    if (upload) setShowUploadModal(true)
  }, [upload])

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
            setVideo({ ...video, buffer, preview, videoType: file.type })
          }
        }
        reader.readAsArrayBuffer(file)
      }
    } catch (error) {
      toast.error('Error uploading file')
    }
  }

  const onCloseUploadModal = () => {
    setShowUploadModal(false)
    push(selectedChannel?.handle, undefined, { shallow: true })
    setVideo({ preview: '', buffer: null, videoType: '' })
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
      show={showUploadModal}
      panelClassName="max-w-4xl !p-4 max-h-[80vh]"
      preventAutoClose={true}
    >
      {video.preview ? (
        <Details video={video} closeUploadModal={onCloseUploadModal} />
      ) : (
        <div
          {...getRootProps()}
          className={clsx(
            'p-10 md:py-20 relative h-full focus:outline-none border-gray-300 dark:border-gray-700 grid place-items-center text-center border-2 border-dashed rounded-lg cursor-pointer'
          )}
        >
          <button
            className="absolute top-0 right-0 p-1 bg-gray-100 rounded-md focus:outline-none dark:bg-gray-900"
            onClick={(e) => {
              e.stopPropagation()
              onCloseUploadModal()
            }}
          >
            <MdOutlineClose />
          </button>
          <div>
            <span className="flex justify-center mb-6 text-4xl opacity-60">
              <FiUpload />
            </span>
            <input {...getInputProps()} />
            <span className="opacity-80">
              {isDragActive ? (
                <p>Drop it here</p>
              ) : (
                <p>Drag and drop your video</p>
              )}
            </span>
          </div>
        </div>
      )}
    </Modal>
  )
}

export default Upload
