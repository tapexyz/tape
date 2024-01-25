import ThumbnailsShimmer from '@components/Shimmers/ThumbnailsShimmer'
import useAppStore from '@lib/store'
import { generateVideoThumbnails, tw } from '@tape.xyz/browser'
import { logger } from '@tape.xyz/generic'
import { AddImageOutline, CheckOutline, Spinner } from '@tape.xyz/ui'
import type { ChangeEvent, FC } from 'react'
import React, { useEffect, useState } from 'react'

interface Props {
  file: File | null
}

const DEFAULT_THUMBNAIL_INDEX = 0
export const THUMBNAIL_GENERATE_COUNT = 9

type Thumbnail = {
  blobUrl: string
  mimeType: string
}

const ChooseThumbnail: FC<Props> = ({ file }) => {
  const [thumbnails, setThumbnails] = useState<Thumbnail[]>([])
  const [selectedThumbnailIndex, setSelectedThumbnailIndex] = useState(-1)
  const uploadedMedia = useAppStore((state) => state.uploadedMedia)
  const setUploadedMedia = useAppStore((state) => state.setUploadedMedia)

  const onSelectThumbnail = async (index: number) => {
    if (uploadedMedia.durationInSeconds === 0) {
      return
    }
    setSelectedThumbnailIndex(index)
    setUploadedMedia({
      thumbnailBlobUrl: thumbnails[index]?.blobUrl
    })
  }

  const generateThumbnails = async (fileToGenerate: File) => {
    try {
      const thumbnailArray = await generateVideoThumbnails(
        fileToGenerate,
        THUMBNAIL_GENERATE_COUNT
      )
      const thumbnailList: Thumbnail[] = []
      thumbnailArray.forEach((thumbnailBlob) => {
        thumbnailList.push({
          blobUrl: thumbnailBlob,
          mimeType: 'image/jpeg'
        })
      })
      setThumbnails(thumbnailList)
      setSelectedThumbnailIndex(DEFAULT_THUMBNAIL_INDEX)
    } catch {}
  }

  useEffect(() => {
    onSelectThumbnail(selectedThumbnailIndex)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedThumbnailIndex])

  useEffect(() => {
    if (file) {
      generateThumbnails(file).catch((error) =>
        logger.error('[Error Generate Thumbnails from File]', error)
      )
    }
    return () => {
      setSelectedThumbnailIndex(-1)
      setThumbnails([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file])

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setSelectedThumbnailIndex(-1)
      const file = e.target.files[0]
      const preview = URL?.createObjectURL(file)
      setThumbnails([
        {
          blobUrl: preview,
          mimeType: file.type || 'image/jpeg'
        },
        ...thumbnails
      ])
      setUploadedMedia({
        thumbnailBlobUrl: preview,
        thumbnailType: file.type || 'image/jpeg'
      })
      setSelectedThumbnailIndex(0)
    }
  }

  return (
    <div className="grid grid-cols-5 gap-2">
      <label
        htmlFor="chooseThumbnail"
        className="tape-border flex h-full w-full flex-none cursor-pointer flex-col items-center justify-center rounded-lg"
      >
        <input
          id="chooseThumbnail"
          type="file"
          accept=".png, .jpg, .jpeg, .webp"
          className="hidden w-full"
          onChange={handleUpload}
        />
        <AddImageOutline className="size-4 flex-none" />
      </label>
      {!thumbnails.length && uploadedMedia.file?.size ? (
        <ThumbnailsShimmer />
      ) : null}
      {thumbnails.map((thumbnail, idx) => {
        return (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectThumbnail(idx)}
            className="tape-border relative h-full w-full flex-none overflow-hidden rounded-md dark:ring-black"
          >
            <img
              className={tw(
                'h-full w-full rounded-md',
                uploadedMedia.isByteVideo ? 'object-contain' : 'object-cover'
              )}
              src={thumbnail.blobUrl}
              alt="thumbnail"
              draggable={false}
            />
            {selectedThumbnailIndex === idx && (
              <div className="absolute inset-0 grid place-items-center bg-gray-800 bg-opacity-50">
                <CheckOutline className="text-brand-500 size-4" />
              </div>
            )}
            {uploadedMedia.uploadingThumbnail &&
              selectedThumbnailIndex === idx && (
                <div className="absolute inset-0 grid place-items-center bg-gray-100 bg-opacity-10 backdrop-blur-md">
                  <Spinner size="sm" />
                </div>
              )}
          </button>
        )
      })}
    </div>
  )
}

export default ChooseThumbnail
