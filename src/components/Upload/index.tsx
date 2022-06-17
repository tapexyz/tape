import Layout from '@components/Common/Layout'
import MetaTags from '@components/Common/MetaTags'
import { Loader } from '@components/UIElements/Loader'
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

const UploadPage = () => {
  const [video, setVideo] = useState<VideoUpload>({
    buffer: null,
    preview: '',
    videoType: '',
    file: null
  })

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
            setVideo({
              ...video,
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
      toast.error('Error uploading file!')
    }
  }

  const afterUpload = () => {
    setVideo({ preview: '', buffer: null, videoType: '', file: null })
  }

  const onDropRejected = (fileRejections: FileRejection[]) => {
    fileRejections[0].errors.forEach((error) => toast.error(error.message))
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
    maxSize: 2147483648 // 2 GB
  })

  return (
    <Layout>
      <MetaTags title="Upload Video" />
      <div className="my-6">
        {video.preview ? (
          <Details video={video} afterUpload={afterUpload} />
        ) : (
          <div
            {...getRootProps()}
            className={clsx(
              'p-10 md:py-20 h-full focus:outline-none border-gray-600 dark:border-gray-400 grid place-items-center text-center border border-dashed rounded-lg cursor-pointer'
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
    </Layout>
  )
}

export default UploadPage
