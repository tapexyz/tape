import imageCdn from '@utils/functions/imageCdn'
import { uploadImageToIPFS } from '@utils/functions/uploadToIPFS'
import clsx from 'clsx'
import { ChangeEvent, FC, useState } from 'react'
import { FiUpload } from 'react-icons/fi'
import { MdOutlineDeleteSweep } from 'react-icons/md'
import { IPFSUploadResult } from 'src/types/local'

import { Loader } from './Loader'

interface Props {
  label: string
  // eslint-disable-next-line no-unused-vars
  afterUpload: (result: IPFSUploadResult | null) => void
  required?: boolean
}

const ChooseImage: FC<Props> = ({ label, afterUpload, required = false }) => {
  const [uploading, setUploading] = useState(false)
  const [ipfsResult, setIpfsResult] = useState<IPFSUploadResult | null>()

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setUploading(true)
      const result: IPFSUploadResult = await uploadImageToIPFS(e.target.files)
      setUploading(false)
      setIpfsResult(result)
      afterUpload(result)
    }
  }

  const onClearUpload = () => {
    setIpfsResult(null)
    afterUpload(null)
  }

  return (
    <div className="w-full">
      {label && (
        <div className="flex items-center mb-1 space-x-1.5">
          <div
            className={clsx('text-[11px] font-semibold uppercase opacity-70', {
              required: required
            })}
          >
            {label}
          </div>
        </div>
      )}
      {ipfsResult ? (
        <div className="relative">
          <img
            className="object-cover w-full h-[166px] rounded-md "
            src={imageCdn(ipfsResult.ipfsUrl)}
            alt=""
            draggable={false}
          />
          <button
            onClick={() => onClearUpload()}
            className="absolute p-1 bg-white rounded-full outline-none cursor-pointer dark:bg-black top-1 right-1"
          >
            <MdOutlineDeleteSweep className="text-red-500" />
          </button>
        </div>
      ) : uploading ? (
        <span className="p-5">
          <Loader />
        </span>
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
    </div>
  )
}

export default ChooseImage
