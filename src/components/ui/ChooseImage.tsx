import { uploadImageToIPFS } from '@utils/functions/uploadToIPFS'
import { ChangeEvent, FC, useState } from 'react'
import { MdOutlineDeleteSweep } from 'react-icons/md'
import { IPFSUploadResult } from 'src/types/local'

interface Props {
  label: string
  // eslint-disable-next-line no-unused-vars
  afterUpload: (result: IPFSUploadResult | null) => void
}

const ChooseImage: FC<Props> = ({ label, afterUpload }) => {
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
      {uploading && !ipfsResult ? (
        'Uploading...'
      ) : (
        <>
          {label && (
            <div className="flex items-center mb-1 space-x-1.5">
              <div className="text-[11px] font-semibold uppercase opacity-70">
                {label}
              </div>
            </div>
          )}
          {ipfsResult ? (
            <div className="relative">
              <img
                className="object-cover w-full h-40 rounded-md "
                src={ipfsResult.ipfsUrl}
                alt=""
              />
              <button
                onClick={() => onClearUpload()}
                className="absolute p-1 bg-white rounded-full outline-none cursor-pointer dark:bg-black top-1 right-1"
              >
                <MdOutlineDeleteSweep className="text-red-500" />
              </button>
            </div>
          ) : (
            <input
              className="text-sm cursor-pointer focus:outline-none"
              type="file"
              accept="image/*"
              onChange={handleUpload}
            />
          )}
        </>
      )}
    </div>
  )
}

export default ChooseImage
