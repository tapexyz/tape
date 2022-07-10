import MetaTags from '@components/Common/MetaTags'
import { Button } from '@components/UIElements/Button'
import useAppStore from '@lib/store'
import clsx from 'clsx'
import React from 'react'
import { FileRejection, useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'
import { FiUpload } from 'react-icons/fi'

const DropZone = () => {
  const { setUploadedVideo } = useAppStore()

  const uploadVideo = async (files: File[]) => {
    const file = files[0]
    try {
      if (file) {
        const preview = URL.createObjectURL(file)
        let reader = new FileReader()
        reader.onload = function () {
          if (reader.result) {
            let buffer = Buffer.from(reader.result as string)
            setUploadedVideo({
              buffer,
              preview,
              videoType: file.type || 'video/mp4',
              file
            })
          }
        }
        reader.readAsArrayBuffer(file)
      }
    } catch (error) {
      toast.error('Error uploading file')
    }
  }

  const onDropRejected = (fileRejections: FileRejection[]) => {
    fileRejections[0].errors.forEach((error) =>
      error.code === 'file-too-large'
        ? toast.error('Video size should not exceed 2GB')
        : toast.error(error.message)
    )
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: uploadVideo,
    onDropRejected,
    accept: {
      'video/mp4': []
      // 'video/webm': ['.webm'],
      // 'video/ogv': ['.ogv'],
      // 'video/ogg': ['.ogg']
    },
    maxFiles: 1,
    multiple: false,
    maxSize: 2147483648 // 2 GB
  })

  return (
    <div>
      <MetaTags title="Select Video" />
      <div className="relative flex flex-col items-center justify-center flex-1 my-20">
        <div
          {...getRootProps()}
          className={clsx(
            'w-full p-10 md:p-20 md:w-2/3 focus:outline-none border-gray-500 grid place-items-center text-center border border-dashed rounded-3xl',
            { 'border-green-500': isDragActive }
          )}
        >
          <>
            <input {...getInputProps()} />
            <span className="flex justify-center mb-6 opacity-80">
              <FiUpload className="text-6xl" />
            </span>
            <span className="space-y-10">
              <div className="text-2xl font-semibold md:text-4xl">
                Drag and drop <br /> video to upload
              </div>
              <Button size="xl">or choose file</Button>
              <div className="text-sm">(Maximum size 2 GB for now)</div>
            </span>
          </>
        </div>
      </div>
    </div>
  )
}

export default DropZone
