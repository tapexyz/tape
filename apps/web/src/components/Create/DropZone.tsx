import UploadOutline from '@components/Common/Icons/UploadOutline'
import useAppStore from '@lib/store'
import { Box, Button } from '@radix-ui/themes'
import { useDragAndDrop } from '@tape.xyz/browser'
import {
  ALLOWED_AUDIO_MIME_TYPES,
  ALLOWED_UPLOAD_MIME_TYPES,
  CREATOR_VIDEO_CATEGORIES
} from '@tape.xyz/constants'
import { canUploadedToIpfs, EVENTS, logger, Tower } from '@tape.xyz/generic'
import clsx from 'clsx'
import fileReaderStream from 'filereader-stream'
import React, { useEffect } from 'react'
import toast from 'react-hot-toast'

const DropZone = () => {
  const setUploadedMedia = useAppStore((state) => state.setUploadedMedia)

  const {
    dragOver,
    fileDropError,
    onDragLeave,
    onDragOver,
    setDragOver,
    setFileDropError
  } = useDragAndDrop()

  useEffect(() => {
    Tower.track(EVENTS.PAGEVIEW, { page: EVENTS.PAGE_VIEW.UPLOAD.DROPZONE })
  }, [])

  const handleUploadedMedia = (file: File) => {
    try {
      if (file) {
        const preview = URL.createObjectURL(file)
        const isAudio = ALLOWED_AUDIO_MIME_TYPES.includes(file?.type)
        const isUnderFreeLimit = canUploadedToIpfs(file?.size)
        setUploadedMedia({
          file,
          isUploadToIpfs: isUnderFreeLimit,
          mediaCategory: isAudio
            ? CREATOR_VIDEO_CATEGORIES[1]
            : CREATOR_VIDEO_CATEGORIES[0],
          mediaType: file?.type,
          preview,
          stream: fileReaderStream(file),
          type: isAudio ? 'AUDIO' : 'VIDEO'
        })
      }
    } catch (error) {
      toast.error('Error uploading file')
      logger.error('[Error Upload Media]', error)
    }
  }

  const validateFile = (file: File) => {
    if (!ALLOWED_UPLOAD_MIME_TYPES.includes(file?.type)) {
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
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        <input
          accept={ALLOWED_UPLOAD_MIME_TYPES.join(',')}
          className="hidden"
          id="dropMedia"
          onChange={onChooseFile}
          type="file"
        />
        <span className="mb-6 flex justify-center opacity-80">
          <UploadOutline className="size-10" />
        </span>
        <span className="space-y-10">
          <div className="space-y-4">
            <p className="text-2xl md:text-4xl">Drag and drop</p>
            <p>Select multimedia from your device.</p>
          </div>
          <Box>
            <Button
              className="!px-0"
              highContrast
              type="button"
              variant="surface"
            >
              <label className="cursor-pointer p-6" htmlFor="chooseMedia">
                Choose
                <input
                  accept={ALLOWED_UPLOAD_MIME_TYPES.join(',')}
                  className="hidden"
                  id="chooseMedia"
                  onChange={onChooseFile}
                  type="file"
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
