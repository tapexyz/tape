import { generateVideoThumbnails } from '@rajesh896/video-thumbnails-generator'
import { dataURLtoFile } from '@utils/functions/getFileFromDataURL'
import imageCdn from '@utils/functions/imageCdn'
import { uploadImageToIPFS } from '@utils/functions/uploadToIPFS'
import clsx from 'clsx'
import { ChangeEvent, FC, useEffect, useState } from 'react'
import { FiUpload } from 'react-icons/fi'
import { IoMdClose } from 'react-icons/io'
import { IPFSUploadResult } from 'src/types/local'

import { Loader } from '../../UIElements/Loader'

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

  const generateThumbnails = (file: File) => {
    generateVideoThumbnails(file, 4, '').then(async (thumbnailArray) => {
      let thumbnails: Array<{ ipfsUrl: string; url: string }> = []
      thumbnailArray.forEach((t) => {
        thumbnails.push({ url: t, ipfsUrl: '' })
      })
      setThumbnails(thumbnails)
      setSelectedThumbnailIndex(0)
      const file = await dataURLtoFile(thumbnails[0].url, 'thumbnail.jpeg')
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

  const onClearUpload = () => {
    setSelectedThumbnailIpfsUrl('')
    afterUpload(null)
    setSelectedThumbnailIndex(-1)
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
            className="object-cover w-full h-[166px] rounded-md "
            src={imageCdn(selectedThumbnailIpfsUrl)}
            alt=""
            draggable={false}
            loading="eager"
          />
          <button
            onClick={() => onClearUpload()}
            className="absolute p-1 bg-white rounded-full outline-none cursor-pointer dark:bg-black top-1.5 right-1.5"
          >
            <IoMdClose className="text-red-500" />
          </button>
        </div>
      ) : uploading ? (
        <div className="h-[166px]">
          <div className="grid h-full place-items-center">
            <Loader />
          </div>
        </div>
      ) : (
        <label className="flex flex-col items-center w-full p-3 space-y-3 border border-gray-200 border-dashed rounded-md cursor-pointer focus:outline-none dark:border-gray-800">
          <input
            type="file"
            accept=".png, .jpg, .jpeg, .svg"
            className="hidden w-full"
            onChange={handleUpload}
          />
          <FiUpload className="text-lg" />
          <p className="text-xs opacity-50">
            SVG, PNG, JPG (recommended - 1280x720px)
          </p>
        </label>
      )}
      <div className="flex mx-0.5 mt-2 space-x-1">
        {thumbnails.map((thumbnail, idx) => {
          return (
            <button
              key={idx}
              onClick={() => onSelectThumbnail(idx)}
              className={clsx('rounded focus:outline-none', {
                'ring ring-indigo-900': selectedThumbnailIndex === idx
              })}
            >
              <img
                className="object-cover w-full h-12 rounded"
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
