import ThumbnailsShimmer from '@components/Shimmers/ThumbnailsShimmer'
import { Loader } from '@components/UIElements/Loader'
import logger from '@lib/logger'
import useAppStore from '@lib/store'
import { captureException } from '@sentry/nextjs'
import * as tf from '@tensorflow/tfjs'
import { IS_MAINNET } from '@utils/constants'
import { generateVideoThumbnails } from '@utils/functions/generateVideoThumbnails'
import { getFileFromDataURL } from '@utils/functions/getFileFromDataURL'
import { getIsNSFW } from '@utils/functions/getIsNSFW'
import { sanitizeIpfsUrl } from '@utils/functions/sanitizeIpfsUrl'
import uploadToIPFS from '@utils/functions/uploadToIPFS'
import clsx from 'clsx'
import * as nsfwjs from 'nsfwjs'
import { ChangeEvent, FC, useEffect, useState } from 'react'
import { BiImageAdd } from 'react-icons/bi'
import { IPFSUploadResult } from 'src/types/local'

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

  const uploadThumbnailToIpfs = async (file: File) => {
    setUploadedVideo({ uploadingThumbnail: true })
    const result: IPFSUploadResult = await uploadToIPFS(file)
    setUploadedVideo({ uploadingThumbnail: false })
    afterUpload(result.url, file.type || 'image/jpeg')
    return result
  }

  const generateThumbnails = async (file: File) => {
    try {
      const thumbnailArray = await generateVideoThumbnails(
        file,
        THUMBNAIL_GENERATE_COUNT
      )
      const thumbnails: Array<{
        ipfsUrl: string
        url: string
        isNSFWThumbnail: boolean
      }> = []
      thumbnailArray.forEach((t) => {
        thumbnails.push({ url: t, ipfsUrl: '', isNSFWThumbnail: false })
      })
      setThumbnails(thumbnails)
      setSelectedThumbnailIndex(DEFAULT_THUMBNAIL_INDEX)
      const imageFile = getFileFromDataURL(
        thumbnails[DEFAULT_THUMBNAIL_INDEX].url,
        'thumbnail.jpeg'
      )
      const ipfsResult = await uploadThumbnailToIpfs(imageFile)
      setThumbnails(
        thumbnails.map((t, i) => {
          if (i === DEFAULT_THUMBNAIL_INDEX) t.ipfsUrl = ipfsResult.url
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
      captureException(error)
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
      const file = getFileFromDataURL(thumbnails[index].url, 'thumbnail.jpeg')
      const ipfsResult = await uploadThumbnailToIpfs(file)
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
        <div className="flex items-center mb-1 space-x-1.5">
          <div
            className={clsx('text-[11px] font-semibold uppercase opacity-70')}
          >
            {label}
          </div>
        </div>
      )}
      <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 place-items-start py-0.5 gap-3">
        <label
          htmlFor="chooseThumbnail"
          className="flex flex-col items-center justify-center flex-none w-full h-16 border border-gray-200 cursor-pointer max-w-32 rounded-xl opacity-80 focus:outline-none dark:border-gray-800"
        >
          <input
            id="chooseThumbnail"
            type="file"
            accept=".png, .jpg, .jpeg"
            className="hidden w-full"
            onChange={handleUpload}
          />
          <BiImageAdd className="flex-none mb-1 text-lg" />
          <span className="text-[10px]">Upload thumbnail</span>
        </label>
        {!thumbnails.length && <ThumbnailsShimmer />}
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
                'rounded-lg w-full relative cursor-grab flex-none focus:outline-none',
                {
                  'ring ring-indigo-500': selectedThumbnailIndex === idx,
                  'ring !ring-red-500': thumbnail.isNSFWThumbnail
                }
              )}
            >
              <img
                className="object-cover w-full h-16 rounded-lg md:w-32"
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
