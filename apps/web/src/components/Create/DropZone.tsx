import UploadOutline from '@components/Common/Icons/UploadOutline'
import { useDragAndDrop } from '@dragverse/browser'
import {
  ALLOWED_AUDIO_MIME_TYPES,
  ALLOWED_UPLOAD_MIME_TYPES,
  CREATOR_VIDEO_CATEGORIES
} from '@dragverse/constants'
import { canUploadedToIpfs, EVENTS, logger, Tower } from '@dragverse/generic'
import useAppStore from '@lib/store'
import { Box, Button } from '@radix-ui/themes'
import clsx from 'clsx'
import fileReaderStream from 'filereader-stream'
import React, { useEffect } from 'react'
import toast from 'react-hot-toast'

const DropZone = () => {
  const setUploadedMedia = useAppStore((state) => state.setUploadedMedia)

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
        const isAudio = ALLOWED_AUDIO_MIME_TYPES.includes(file?.type)
        const isUnderFreeLimit = canUploadedToIpfs(file?.size)
        setUploadedMedia({
          stream: fileReaderStream(file),
          preview,
          mediaType: file?.type,
          file,
          type: isAudio ? 'AUDIO' : 'VIDEO',
          mediaCategory: isAudio
            ? CREATOR_VIDEO_CATEGORIES[1]
            : CREATOR_VIDEO_CATEGORIES[0],
          isUploadToIpfs: isUnderFreeLimit
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
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <input
          type="file"
          className="hidden"
          onChange={onChooseFile}
          id="dropMedia"
          accept={ALLOWED_UPLOAD_MIME_TYPES.join(',')}
        />
        <span className="mb-6 flex justify-center opacity-80">
          <UploadOutline className="h-10 w-10" />
        </span>
        <span className="space-y-10">
          <div className="space-y-4">
            <p className="text-2xl md:text-4xl">Drag and drop to STUNT✨</p>
            <p>
              Upload a piece of multimedia (video or audio file) from your
              device.
            </p>
          </div>
          <Box>
            <Button
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
                  accept={ALLOWED_UPLOAD_MIME_TYPES.join(',')}
                />
              </label>
            </Button>
          </Box>
          {fileDropError && (
            <div className="font-medium text-red-500">{fileDropError}</div>
          )}
        </span>
      </label>
      <footer className="bg-brand-850 dark:bg-brand-850 block py-4 text-center md:hidden">
        <p className="text-brand-50 dark:text-brand-50 text-sm">
          We are a decentralized open-source social network built by and for the
          Drag community, brick by brick, to create content and share their
          artistry.🌈 Powered with{' '}
          <a
            href="https://tape.xyz"
            className="text-blue-500 hover:text-blue-700"
          >
            tape.xyz
          </a>
        </p>
      </footer>
    </div>
  )
}

export default DropZone
