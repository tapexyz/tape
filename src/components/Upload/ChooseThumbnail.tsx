import { Loader } from '@components/UIElements/Loader'
import { generateVideoThumbnails } from '@rajesh896/video-thumbnails-generator'
import { dataURLtoFile } from '@utils/functions/getFileFromDataURL'
import imageCdn from '@utils/functions/imageCdn'
import { uploadImageToIPFS } from '@utils/functions/uploadToIPFS'
import useDraggableScroll from '@utils/hooks/useDraggableScroll'
import clsx from 'clsx'
import { ChangeEvent, FC, useEffect, useRef, useState } from 'react'
import { BsCardImage } from 'react-icons/bs'
import { IPFSUploadResult } from 'src/types/local'

interface Props {
  label: string
  // eslint-disable-next-line no-unused-vars
  afterUpload: (result: IPFSUploadResult | null) => void
  file: File | null
}

const ChooseThumbnail: FC<Props> = ({ label, afterUpload, file }) => {
  const [uploading, setUploading] = useState(false)
  const [selectedThumbnailIpfsUrl, setSelectedThumbnailIpfsUrl] = useState('')
  const [thumbnails, setThumbnails] = useState<
    Array<{ ipfsUrl: string; url: string }>
  >([])
  const [selectedThumbnailIndex, setSelectedThumbnailIndex] = useState(-1)
  const scrollRef = useRef<null | HTMLDivElement>(null)
  const { onMouseDown } = useDraggableScroll(scrollRef)

  const generateThumbnails = (file: File) => {
    generateVideoThumbnails(file, 6, '').then(async (thumbnailArray) => {
      let thumbnails: Array<{ ipfsUrl: string; url: string }> = []
      thumbnailArray.forEach((t) => {
        thumbnails.push({ url: t, ipfsUrl: '' })
      })
      setThumbnails(thumbnails)
      setSelectedThumbnailIndex(1)
      const file = await dataURLtoFile(thumbnails[1].url, 'thumbnail.jpeg')
      const ipfsResult = await uploadThumbnailToIpfs(file)
      setThumbnails(
        thumbnails.map((t, i) => {
          if (i === 0) t.ipfsUrl = ipfsResult.ipfsUrl
          return t
        })
      )
    })
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
    setSelectedThumbnailIpfsUrl(result.ipfsUrl)
    afterUpload(result)
    return result
  }

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      uploadThumbnailToIpfs(e.target.files[0])
      setSelectedThumbnailIndex(-1)
    }
  }

  const onSelectThumbnail = async (index: number) => {
    setSelectedThumbnailIndex(index)
    if (thumbnails[index].ipfsUrl === '') {
      const file = await dataURLtoFile(thumbnails[index].url, 'thumbnail.jpeg')
      const ipfsResult = await uploadThumbnailToIpfs(file)
      setThumbnails(
        thumbnails.map((t, i) => {
          if (i === index) t.ipfsUrl = ipfsResult.ipfsUrl
          return t
        })
      )
    } else {
      setSelectedThumbnailIpfsUrl(thumbnails[index].ipfsUrl)
    }
  }

  return (
    <div className="w-full">
      {label && (
        <div className="flex items-center mb-1 space-x-1.5">
          <div
            className={clsx(
              'text-[11px] required font-semibold uppercase opacity-70'
            )}
          >
            {label}
          </div>
        </div>
      )}
      {selectedThumbnailIpfsUrl && !uploading ? (
        <div className="relative">
          <img
            className="object-cover w-full h-[200px] rounded-xl"
            src={imageCdn(selectedThumbnailIpfsUrl)}
            alt=""
            draggable={false}
            loading="eager"
          />
        </div>
      ) : (
        <div className="h-[200px]">
          <div className="grid h-full place-items-center">
            {uploading ? <Loader /> : ''}
          </div>
        </div>
      )}
      <div
        ref={scrollRef}
        onMouseDown={onMouseDown}
        className="flex flex-row py-1 mt-2 space-x-2 overflow-x-auto cursor-grab no-scrollbar"
      >
        <label className="flex flex-col items-center justify-center flex-none w-32 h-16 p-5 border border-gray-200 border-dashed cursor-pointer rounded-xl focus:outline-none dark:border-gray-800">
          <input
            type="file"
            accept=".png, .jpg, .jpeg"
            className="hidden w-full"
            onChange={handleUpload}
          />
          <BsCardImage className="text-lg" />
        </label>
        {thumbnails.map((thumbnail, idx) => {
          return (
            <button
              key={idx}
              onClick={() => onSelectThumbnail(idx)}
              className={clsx(
                'rounded cursor-grab flex-none focus:outline-none',
                {
                  'ring ring-indigo-500': selectedThumbnailIndex === idx
                }
              )}
            >
              <img
                className="object-cover w-32 h-16 rounded"
                src={thumbnail.url}
                alt=""
                draggable={false}
              />
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default ChooseThumbnail
