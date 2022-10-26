import MetaTags from '@components/Common/MetaTags'
import logger from '@lib/logger'
import useAppStore from '@lib/store'
import { ALLOWED_VIDEO_TYPES } from '@utils/constants'
import useDragAndDrop from '@utils/hooks/useDragAndDrop'
import { Mixpanel, TRACK } from '@utils/track'
import clsx from 'clsx'
import fileReaderStream from 'filereader-stream'
import React, { useEffect } from 'react'
import toast from 'react-hot-toast'
import { FiUpload } from 'react-icons/fi'

const DropZone = () => {
  const setUploadedVideo = useAppStore((state) => state.setUploadedVideo)
  const {
    dragOver,
    setDragOver,
    onDragOver,
    onDragLeave,
    fileDropError,
    setFileDropError
  } = useDragAndDrop()

  useEffect(() => {
    Mixpanel.track('Pageview', { path: TRACK.PAGE_VIEW.UPLOAD.DROPZONE })
  }, [])

  const uploadVideo = (file: File) => {
    try {
      if (file) {
        const preview = URL.createObjectURL(file)
        setUploadedVideo({
          stream: fileReaderStream(file),
          preview,
          videoType: file.type || 'video/mp4',
          file
        })
      }
    } catch (error) {
      toast.error('Error uploading file')
      logger.error('[Error Upload Video]', error)
    }
  }

  const validateFile = (file: File) => {
    if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
      toast.error('Video format are supported!')
      return setFileDropError('Video format are supported!')
    }
    uploadVideo(file)
  }

  const onDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    setDragOver(false)
    validateFile(e?.dataTransfer?.files[0])
  }

  const onChooseFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) validateFile(e?.target?.files[0])
  }

  return (
    <div>
      <MetaTags title="Select Video" />
      <div className="relative flex flex-col items-center justify-center flex-1 my-20">
        <label
          className={clsx(
            'w-full p-10 md:p-20 md:w-2/3 focus:outline-none border-gray-500 grid place-items-center text-center border border-dashed rounded-3xl',
            { '!border-green-500': dragOver }
          )}
          htmlFor="dropVideo"
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          <input
            type="file"
            className="hidden"
            id="dropVideo"
            accept={ALLOWED_VIDEO_TYPES.join(',')}
          />
          <span className="flex justify-center mb-6 opacity-80">
            <FiUpload className="text-6xl" />
          </span>
          <span className="space-y-10 md:space-y-14">
            <div className="text-2xl font-semibold md:text-4xl">
              <span>
                Drag and drop <br /> video to upload
              </span>
            </div>
            <div>
              <label
                htmlFor="chooseVideo"
                className="px-8 py-4 text-lg text-white bg-indigo-500 cursor-pointer rounded-xl"
              >
                or choose video
                <input
                  id="chooseVideo"
                  onChange={onChooseFile}
                  type="file"
                  className="hidden"
                  accept={ALLOWED_VIDEO_TYPES.join(',')}
                />
              </label>
            </div>
            {fileDropError && (
              <div className="font-medium text-red-500">{fileDropError}</div>
            )}
          </span>
        </label>
      </div>
    </div>
  )
}

export default DropZone
