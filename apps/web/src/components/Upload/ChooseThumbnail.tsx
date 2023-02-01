import ThumbnailsShimmer from '@components/Shimmers/ThumbnailsShimmer'
import { Loader } from '@components/UIElements/Loader'
import useAppStore from '@lib/store'
import * as tf from '@tensorflow/tfjs'
import clsx from 'clsx'
import * as nsfwjs from 'nsfwjs'
import type { ChangeEvent, FC } from 'react'
import React, { useEffect, useState } from 'react'
import { BiImageAdd } from 'react-icons/bi'
import type { IPFSUploadResult } from 'utils'
import { IS_MAINNET } from 'utils'
import { generateVideoThumbnails } from 'utils/functions/generateVideoThumbnails'
import { getFileFromDataURL } from 'utils/functions/getFileFromDataURL'
import { getIsNSFW } from 'utils/functions/getIsNSFW'
import sanitizeIpfsUrl from 'utils/functions/sanitizeIpfsUrl'
import uploadToIPFS from 'utils/functions/uploadToIPFS'
import logger from 'utils/logger'

if (IS_MAINNET) {
  tf.enableProdMode()
}

interface Props {
  label: string
  afterUpload: (ipfsUrl: string, thumbnailType: string) => void
  file: File | null
}

const DEFAULT_THUMBNAIL_INDEX = 0
export const THUMBNAIL_GENERATE_COUNT = 7

const ChooseThumbnail: FC<Props> = ({ label, afterUpload, file }) => {
  const [thumbnails, setThumbnails] = useState<
    Array<{ ipfsUrl: string; url: string; isNSFWThumbnail: boolean }>
  >([])
  const [selectedThumbnailIndex, setSelectedThumbnailIndex] = useState(-1)
  const setUploadedVideo = useAppStore((state) => state.setUploadedVideo)
  const uploadedVideo = useAppStore((state) => state.uploadedVideo)

  const uploadThumbnailToIpfs = async (fileToUpload: File) => {
    setUploadedVideo({ uploadingThumbnail: true })
    const result: IPFSUploadResult = await uploadToIPFS(fileToUpload)
    setUploadedVideo({ uploadingThumbnail: false })
    afterUpload(result.url, fileToUpload.type || 'image/jpeg')
    return result
  }

  const generateThumbnails = async (fileToGenerate: File) => {
    try {
      const thumbnailArray = await generateVideoThumbnails(
        fileToGenerate,
        THUMBNAIL_GENERATE_COUNT
      )
      const thumbnailList: Array<{
        ipfsUrl: string
        url: string
        isNSFWThumbnail: boolean
      }> = []
      thumbnailArray.forEach((t) => {
        thumbnailList.push({ url: t, ipfsUrl: '', isNSFWThumbnail: false })
      })
      setThumbnails(thumbnailList)
      setSelectedThumbnailIndex(DEFAULT_THUMBNAIL_INDEX)
      const imageFile = getFileFromDataURL(
        thumbnailList[DEFAULT_THUMBNAIL_INDEX]?.url,
        'thumbnail.jpeg'
      )
      const ipfsResult = await uploadThumbnailToIpfs(imageFile)
      setThumbnails(
        thumbnailList.map((t, i) => {
          if (i === DEFAULT_THUMBNAIL_INDEX) t.ipfsUrl = ipfsResult?.url
          return t
        })
      )
    } catch (error) {
      logger.error('[Error Generate Thumbnails]', error)
    }
  }

  useEffect(() => {
    if (file)
      generateThumbnails(file).catch((error) =>
        logger.error('[Error Generate Thumbnails from File]', error)
      )
    return () => {
      setSelectedThumbnailIndex(-1)
      setThumbnails([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file])

  const checkNsfw = async (source: string) => {
    const img = document.createElement('img')
    img.src = source
    img.height = 200
    img.width = 400
    let predictions: nsfwjs.predictionType[] = []
    try {
      const model = await nsfwjs.load()
      predictions = await model?.classify(img, 3)
    } catch (error) {
      logger.error('[Error Check NSFW]', error)
    }
    return getIsNSFW(predictions)
  }

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setSelectedThumbnailIndex(-1)
      const result = await uploadThumbnailToIpfs(e.target.files[0])
      const preview = window.URL?.createObjectURL(e.target.files[0])
      const isNSFWThumbnail = await checkNsfw(preview)
      setUploadedVideo({ isNSFWThumbnail })
      setThumbnails([
        { url: preview, ipfsUrl: result.url, isNSFWThumbnail },
        ...thumbnails
      ])
      setSelectedThumbnailIndex(0)
    }
  }

  const onSelectThumbnail = async (index: number) => {
    setSelectedThumbnailIndex(index)
    if (thumbnails[index].ipfsUrl === '') {
      const selectedImage = getFileFromDataURL(
        thumbnails[index].url,
        'thumbnail.jpeg'
      )
      const ipfsResult = await uploadThumbnailToIpfs(selectedImage)
      setThumbnails(
        thumbnails.map((t, i) => {
          if (i === index) t.ipfsUrl = ipfsResult.url
          return t
        })
      )
    } else {
      afterUpload(thumbnails[index].ipfsUrl, 'image/jpeg')
      setUploadedVideo({ isNSFWThumbnail: thumbnails[index]?.isNSFWThumbnail })
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
          <BiImageAdd className="mb-1 flex-none text-lg" />
          <span className="text-[10px]">Upload thumbnail</span>
        </label>
        {!thumbnails.length && uploadedVideo.file?.size && (
          <ThumbnailsShimmer />
        )}
        {thumbnails.map((thumbnail, idx) => {
          return (
            <button
              key={idx}
              type="button"
              disabled={
                uploadedVideo.uploadingThumbnail &&
                selectedThumbnailIndex === idx
              }
              onClick={() => onSelectThumbnail(idx)}
              className={clsx(
                'relative w-full flex-none rounded-lg focus:outline-none',
                {
                  'ring ring-indigo-500': selectedThumbnailIndex === idx,
                  'ring !ring-red-500': thumbnail.isNSFWThumbnail
                }
              )}
            >
              <img
                className="h-16 w-full rounded-lg object-cover md:w-32"
                src={sanitizeIpfsUrl(thumbnail.url)}
                alt="thumbnail"
                draggable={false}
              />
              {uploadedVideo.uploadingThumbnail &&
                selectedThumbnailIndex === idx && (
                  <div className="absolute top-1 right-1">
                    <span>
                      <Loader size="sm" className="!text-white" />
                    </span>
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
