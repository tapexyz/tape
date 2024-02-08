import useHandleWrongNetwork from '@hooks/useHandleWrongNetwork'
import useAppStore from '@lib/store'
import useProfileStore from '@lib/store/idb/profile'
import { tw, useDragAndDrop } from '@tape.xyz/browser'
import {
  ALLOWED_AUDIO_MIME_TYPES,
  ALLOWED_UPLOAD_MIME_TYPES,
  CREATOR_VIDEO_CATEGORIES
} from '@tape.xyz/constants'
import { canUploadedToIpfs, logger } from '@tape.xyz/generic'
import { Button, UploadOutline } from '@tape.xyz/ui'
import fileReaderStream from 'filereader-stream'
import React from 'react'
import toast from 'react-hot-toast'

const DropZone = () => {
  const setUploadedMedia = useAppStore((state) => state.setUploadedMedia)
  const activeProfile = useProfileStore((state) => state.activeProfile)
  const handleWrongNetwork = useHandleWrongNetwork()

  const {
    setDragOver,
    onDragOver,
    onDragLeave,
    fileDropError,
    setFileDropError
  } = useDragAndDrop()

  const handleUploadedMedia = async (file: File) => {
    await handleWrongNetwork()

    try {
      if (file) {
        const preview = URL.createObjectURL(file)
        const isAudio = ALLOWED_AUDIO_MIME_TYPES.includes(file?.type)
        const isUploadToIpfs = canUploadedToIpfs(
          file?.size || 0,
          activeProfile?.sponsor
        )
        setUploadedMedia({
          stream: fileReaderStream(file),
          preview,
          mediaType: file?.type,
          file,
          type: isAudio ? 'AUDIO' : 'VIDEO',
          mediaCategory: isAudio
            ? CREATOR_VIDEO_CATEGORIES[1]
            : CREATOR_VIDEO_CATEGORIES[0],
          isUploadToIpfs
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
        className={tw(
          'tape-border rounded-medium grid h-full w-full place-content-center place-items-center p-10 text-center focus:outline-none md:p-20'
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
          <UploadOutline className="size-10" />
        </span>
        <span className="space-y-10">
          <div className="space-y-4">
            <p className="text-2xl md:text-4xl">Drag and drop</p>
            <p>Select multimedia from your device.</p>
          </div>
          <div className="flex justify-center">
            <Button variant="secondary" type="button">
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
          </div>
          {fileDropError && (
            <div className="font-medium text-red-500">{fileDropError}</div>
          )}
        </span>
      </label>
    </div>
  )
}

export default DropZone
