import UploadOutline from '@components/Common/Icons/UploadOutline'
import MetaTags from '@components/Common/MetaTags'
import { useDragAndDrop } from '@lenstube/browser'
import { ALLOWED_VIDEO_TYPES, Analytics, TRACK } from '@lenstube/constants'
import { canUploadedToIpfs, logger } from '@lenstube/generic'
import useAppStore from '@lib/store'
import { t, Trans } from '@lingui/macro'
import clsx from 'clsx'
import fileReaderStream from 'filereader-stream'
import React, { useEffect } from 'react'
import toast from 'react-hot-toast'

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
    Analytics.track('Pageview', { path: TRACK.PAGE_VIEW.UPLOAD.DROPZONE })
  }, [])

  const uploadVideo = (file: File) => {
    try {
      if (file) {
        const preview = URL.createObjectURL(file)
        const isUnderFreeLimit = canUploadedToIpfs(file?.size)
        setUploadedVideo({
          stream: fileReaderStream(file),
          preview,
          videoType: file?.type || 'video/mp4',
          file,
          isUploadToIpfs: isUnderFreeLimit
        })
      }
    } catch (error) {
      toast.error(t`Error uploading file`)
      logger.error('[Error Upload Video]', error)
    }
  }

  const validateFile = (file: File) => {
    if (!ALLOWED_VIDEO_TYPES.includes(file?.type)) {
      const errorMessage = t`Video format not supported`
      toast.error(errorMessage)
      return setFileDropError(errorMessage)
    }
    uploadVideo(file)
  }

  const onDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    setDragOver(false)
    validateFile(e?.dataTransfer?.files[0])
  }

  const onChooseFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      validateFile(e?.target?.files[0])
    }
  }

  return (
    <div>
      <MetaTags title={t`Select Video`} />
      <div className="relative my-20 flex flex-1 flex-col items-center justify-center">
        <label
          className={clsx(
            'grid w-full place-items-center rounded-3xl border border-dashed border-gray-500 p-10 text-center focus:outline-none md:w-2/3 md:p-20',
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
            onChange={onChooseFile}
            id="dropVideo"
            accept={ALLOWED_VIDEO_TYPES.join(',')}
          />
          <span className="mb-6 flex justify-center opacity-80">
            <UploadOutline className="h-14 w-14" />
          </span>
          <span className="space-y-10 md:space-y-14">
            <div className="text-2xl font-semibold md:text-4xl">
              <span>
                <Trans>Drag and drop</Trans> <br />
                <Trans>video to upload</Trans>
              </span>
            </div>
            <div>
              <label
                htmlFor="chooseVideo"
                className="btn-primary cursor-pointer px-8 py-4 text-lg"
              >
                <Trans>or choose video</Trans>
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
