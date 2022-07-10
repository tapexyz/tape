import { Loader } from '@components/UIElements/Loader'
import { generateVideoThumbnails } from '@rajesh896/video-thumbnails-generator'
import { getFileFromDataURL } from '@utils/functions/getFileFromDataURL'
import { uploadImageToIPFS } from '@utils/functions/uploadToIPFS'
import useDraggableScroll from '@utils/hooks/useDraggableScroll'
import clsx from 'clsx'
import { ChangeEvent, FC, useEffect, useRef, useState } from 'react'
import { BiImageAdd } from 'react-icons/bi'
import { IPFSUploadResult } from 'src/types/local'

interface Props {
  label: string
  // eslint-disable-next-line no-unused-vars
  afterUpload: (ipfsUrl: string, thumbnailType: string) => void
  file: File | null
}

const DEFAULT_THUMBNAIL_INDEX = 1
const GENERATE_COUNT = 2

const ChooseThumbnail: FC<Props> = ({ label, afterUpload, file }) => {
  const [uploading, setUploading] = useState(false)
  const [thumbnails, setThumbnails] = useState<
    Array<{ ipfsUrl: string; url: string }>
  >([])
  const [selectedThumbnailIndex, setSelectedThumbnailIndex] = useState(-1)
  const scrollRef = useRef<null | HTMLDivElement>(null)
  const { onMouseDown } = useDraggableScroll(scrollRef)

  const generateThumbnails = (file: File) => {
    generateVideoThumbnails(file, GENERATE_COUNT, '').then(
      async (thumbnailArray) => {
        let thumbnails: Array<{ ipfsUrl: string; url: string }> = []
        thumbnailArray.forEach((t) => {
          thumbnails.push({ url: t, ipfsUrl: '' })
        })
        setThumbnails(thumbnails)
        setSelectedThumbnailIndex(DEFAULT_THUMBNAIL_INDEX)
        const file = await getFileFromDataURL(
          thumbnails[DEFAULT_THUMBNAIL_INDEX].url,
          'thumbnail.jpeg'
        )
        const ipfsResult = await uploadThumbnailToIpfs(file)
        setThumbnails(
          thumbnails.map((t, i) => {
            if (i === DEFAULT_THUMBNAIL_INDEX) t.ipfsUrl = ipfsResult.ipfsUrl
            return t
          })
        )
      }
    )
  }

  useEffect(() => {
    if (file) generateThumbnails(file)
    return () => {
      setSelectedThumbnailIndex(-1)
      setThumbnails([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file])

  const uploadThumbnailToIpfs = async (file: File) => {
    setUploading(true)
    const result: IPFSUploadResult = await uploadImageToIPFS(file)
    setUploading(false)
    afterUpload(result.ipfsUrl, file.type || 'image/jpeg')
    return result
  }

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const result = await uploadThumbnailToIpfs(e.target.files[0])
      const preview = URL.createObjectURL(e.target.files[0])
      setThumbnails([{ url: preview, ipfsUrl: result.ipfsUrl }, ...thumbnails])
      setSelectedThumbnailIndex(0)
    }
  }

  const onSelectThumbnail = async (index: number) => {
    setSelectedThumbnailIndex(index)
    if (thumbnails[index].ipfsUrl === '') {
      const file = await getFileFromDataURL(
        thumbnails[index].url,
        'thumbnail.jpeg'
      )
      const ipfsResult = await uploadThumbnailToIpfs(file)
      setThumbnails(
        thumbnails.map((t, i) => {
          if (i === index) t.ipfsUrl = ipfsResult.ipfsUrl
          return t
        })
      )
    } else {
      afterUpload(thumbnails[index].ipfsUrl, 'image/jpeg')
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
      <div
        ref={thumbnails.length > 0 ? scrollRef : null}
        onMouseDown={thumbnails.length > 0 ? onMouseDown : () => {}}
        className={clsx('flex flex-row py-0.5 pr-2 space-x-2', {
          'overflow-x-auto cursor-grab no-scrollbar': thumbnails.length > 0
        })}
      >
        <label className="flex flex-col items-center justify-center flex-none w-32 h-16 border border-gray-200 cursor-pointer rounded-xl opacity-80 focus:outline-none dark:border-gray-800">
          <input
            type="file"
            accept=".png, .jpg, .jpeg"
            className="hidden w-full"
            onChange={handleUpload}
          />
          <BiImageAdd className="flex-none mb-1 text-lg" />
          <span className="text-[9px]">Choose thumbnail</span>
        </label>
        {thumbnails.map((thumbnail, idx) => {
          return (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectThumbnail(idx)}
              className={clsx(
                'rounded-lg relative cursor-grab flex-none focus:outline-none',
                {
                  'ring ring-indigo-500': selectedThumbnailIndex === idx
                }
              )}
            >
              <img
                className="object-cover w-32 h-16 rounded-lg"
                src={thumbnail.url}
                alt=""
                draggable={false}
              />
              {uploading && selectedThumbnailIndex === idx && (
                <div className="absolute top-1 right-1">
                  <span className="">
                    <Loader size="sm" className="!text-indigo-500" />
                  </span>
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default ChooseThumbnail
