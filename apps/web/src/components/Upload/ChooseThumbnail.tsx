import AddImageOutline from '@components/Common/Icons/AddImageOutline'
import ThumbnailsShimmer from '@components/Shimmers/ThumbnailsShimmer'
import { Loader } from '@components/UIElements/Loader'
import useAppStore from '@lib/store'
import clsx from 'clsx'
import type { ChangeEvent, FC } from 'react'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import type { IPFSUploadResult } from 'utils'
import { generateVideoThumbnails } from 'utils/functions/generateVideoThumbnails'
import { getFileFromDataURL } from 'utils/functions/getFileFromDataURL'
import sanitizeDStorageUrl from 'utils/functions/sanitizeDStorageUrl'
import uploadToIPFS from 'utils/functions/uploadToIPFS'
import logger from 'utils/logger'

interface Props {
  label: string
  file: File | null
}

const DEFAULT_THUMBNAIL_INDEX = 0
export const THUMBNAIL_GENERATE_COUNT = 7

type Thumbnail = {
  blobUrl: string
  ipfsUrl: string
  mimeType: string
}

const ChooseThumbnail: FC<Props> = ({ label, file }) => {
  const [thumbnails, setThumbnails] = useState<Thumbnail[]>([])
  const [selectedThumbnailIndex, setSelectedThumbnailIndex] = useState(-1)
  const setUploadedVideo = useAppStore((state) => state.setUploadedVideo)
  const uploadedVideo = useAppStore((state) => state.uploadedVideo)

  const uploadThumbnailToIpfs = async (fileToUpload: File) => {
    setUploadedVideo({ uploadingThumbnail: true })
    const result: IPFSUploadResult = await uploadToIPFS(fileToUpload)
    if (!result.url) {
      toast.error('Failed to upload thumbnail')
    }
    setUploadedVideo({
      thumbnail: result.url,
      thumbnailType: fileToUpload.type || 'image/jpeg',
      uploadingThumbnail: false
    })
    return result
  }

  const generateThumbnails = async (fileToGenerate: File) => {
    try {
      const thumbnailArray = await generateVideoThumbnails(
        fileToGenerate,
        THUMBNAIL_GENERATE_COUNT
      )
      const thumbnailList: Thumbnail[] = []
      thumbnailArray.forEach((t) => {
        thumbnailList.push({ blobUrl: t, ipfsUrl: '', mimeType: 'image/jpeg' })
      })
      setThumbnails(thumbnailList)
      setSelectedThumbnailIndex(DEFAULT_THUMBNAIL_INDEX)
      const imageFile = getFileFromDataURL(
        thumbnailList[DEFAULT_THUMBNAIL_INDEX]?.blobUrl,
        'thumbnail.jpeg'
      )
      if (!imageFile) {
        return toast.error('Please upload a custom thumbnail')
      }
      const ipfsResult = await uploadThumbnailToIpfs(imageFile)
      setThumbnails(
        thumbnailList.map((t, i) => {
          if (i === DEFAULT_THUMBNAIL_INDEX) {
            t.ipfsUrl = ipfsResult?.url
          }
          return t
        })
      )
    } catch {}
  }

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
      toast.loading('Uploading thumbnail')
      const file = e.target.files[0]
      const result = await uploadThumbnailToIpfs(file)
      const preview = window.URL?.createObjectURL(file)
      setThumbnails([
        {
          blobUrl: preview,
          ipfsUrl: result.url,
          mimeType: file.type || 'image/jpeg'
        },
        ...thumbnails
      ])
      setSelectedThumbnailIndex(0)
    }
  }

  const onSelectThumbnail = async (index: number) => {
    setSelectedThumbnailIndex(index)
    if (thumbnails[index].ipfsUrl === '') {
      const selectedImage = getFileFromDataURL(
        thumbnails[index].blobUrl,
        'thumbnail.jpeg'
      )
      if (!selectedImage) {
        return toast.error('Please upload a custom thumbnail')
      }
      const ipfsResult = await uploadThumbnailToIpfs(selectedImage)
      setThumbnails(
        thumbnails.map((t, i) => {
          if (i === index) {
            t.ipfsUrl = ipfsResult.url
          }
          return t
        })
      )
    } else {
      setUploadedVideo({
        thumbnail: thumbnails[index].ipfsUrl,
        thumbnailType: thumbnails[index].mimeType || 'image/jpeg',
        uploadingThumbnail: false
      })
    }
  }

  return (
    <div className="w-full">
      {label && (
        <div className="mb-1 flex items-center space-x-1.5">
          <div className="text-[11px] font-semibold uppercase opacity-70">
            {label}
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 place-items-start gap-3 py-0.5 md:grid-cols-3 lg:grid-cols-4">
        <label
          htmlFor="chooseThumbnail"
          className="max-w-32 flex h-16 w-full flex-none cursor-pointer flex-col items-center justify-center rounded-xl border border-gray-300 opacity-80 focus:outline-none dark:border-gray-700"
        >
          <input
            id="chooseThumbnail"
            type="file"
            accept=".png, .jpg, .jpeg"
            className="hidden w-full"
            onChange={handleUpload}
          />
          <AddImageOutline className="mb-1 h-4 w-4 flex-none" />
          <span className="text-xs">Upload</span>
        </label>
        {!thumbnails.length && uploadedVideo.file?.size && (
          <ThumbnailsShimmer />
        )}
        {thumbnails.map((thumbnail, idx) => {
          return (
            <button
              key={idx}
              type="button"
              disabled={uploadedVideo.uploadingThumbnail}
              onClick={() => onSelectThumbnail(idx)}
              className={clsx(
                'relative w-full flex-none overflow-hidden rounded-lg ring ring-transparent focus:outline-none',
                {
                  'ring !ring-indigo-500':
                    thumbnail.ipfsUrl &&
                    selectedThumbnailIndex === idx &&
                    thumbnail.ipfsUrl === uploadedVideo.thumbnail
                }
              )}
            >
              <img
                className="h-16 w-full rounded-lg object-cover md:w-32"
                src={sanitizeDStorageUrl(thumbnail.blobUrl)}
                alt="thumbnail"
                draggable={false}
              />
              {uploadedVideo.uploadingThumbnail &&
                selectedThumbnailIndex === idx && (
                  <div className="absolute inset-0 grid place-items-center bg-gray-100 bg-opacity-10 backdrop-blur-md">
                    <Loader size="sm" />
                  </div>
                )}
            </button>
          )
        })}
      </div>
      {!uploadedVideo.thumbnail.length &&
      !uploadedVideo.uploadingThumbnail &&
      thumbnails.length ? (
        <p className="mt-2 text-xs font-medium text-red-500">
          Please choose a thumbnail
        </p>
      ) : null}
    </div>
  )
}

export default ChooseThumbnail
