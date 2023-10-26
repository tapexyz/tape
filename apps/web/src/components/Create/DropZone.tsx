import UploadOutline from '@components/Common/Icons/UploadOutline'
import useAppStore from '@lib/store'
import { Box, Button } from '@radix-ui/themes'
import { useDragAndDrop } from '@tape.xyz/browser'
import { ALLOWED_VIDEO_MIME_TYPES } from '@tape.xyz/constants'
import { canUploadedToIpfs, EVENTS, logger, Tower } from '@tape.xyz/generic'
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
    Tower.track(EVENTS.PAGEVIEW, { page: EVENTS.PAGE_VIEW.UPLOAD.DROPZONE })
  }, [])

  const handleUploadedMedia = (file: File) => {
    try {
      if (file) {
        const preview = URL.createObjectURL(file)
        const isUnderFreeLimit = canUploadedToIpfs(file?.size)
        setUploadedVideo({
          stream: fileReaderStream(file),
          preview,
          mediaType: file?.type,
          file,
          isUploadToIpfs: isUnderFreeLimit
        })
      }
    } catch (error) {
      toast.error('Error uploading file')
      logger.error('[Error Upload Media]', error)
    }
  }

  const validateFile = (file: File) => {
    if (!ALLOWED_VIDEO_MIME_TYPES.includes(file?.type)) {
      const errorMessage = `Media format (${file?.type}) not supported`
      toast.error(errorMessage)
      return setFileDropError(errorMessage)
    }
    handleUploadedMedia(file)
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
    <div className="relative flex w-full flex-1 flex-col">
      <label
        className={clsx(
          'grid w-full place-items-center rounded-3xl border border-dashed p-10 text-center focus:outline-none md:p-20',
          dragOver ? 'border-green-500' : 'border-gray-500'
        )}
        htmlFor="dropMedia"
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <input
          type="file"
          className="hidden"
          onChange={onChooseFile}
          id="dropMedia"
          accept={ALLOWED_VIDEO_MIME_TYPES.join(',')}
        />
        <span className="mb-6 flex justify-center opacity-80">
          <UploadOutline className="h-10 w-10" />
        </span>
        <span className="space-y-10">
          <div className="space-y-4">
            <p className="text-2xl md:text-4xl">Drag and drop</p>
            <p>Select multimedia from your device.</p>
          </div>
          <Box>
            <Button
              size="3"
              highContrast
              variant="surface"
              className="!px-0"
              type="button"
            >
              <label htmlFor="chooseMedia" className="cursor-pointer p-6">
                Choose
                <input
                  id="chooseMedia"
                  onChange={onChooseFile}
                  type="file"
                  className="hidden"
                  accept={ALLOWED_VIDEO_MIME_TYPES.join(',')}
                />
              </label>
            </Button>
          </Box>
          {fileDropError && (
            <div className="font-medium text-red-500">{fileDropError}</div>
          )}
        </span>
      </label>
    </div>
  )
}

export default DropZone
