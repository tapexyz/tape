import Tooltip from '@components/UIElements/Tooltip'
import useAppStore from '@lib/store'
import { isLessThan100MB } from '@utils/functions/getSizeFromBytes'
import React from 'react'
import { BiCheck } from 'react-icons/bi'

const UploadMethod = () => {
  const uploadedVideo = useAppStore((state) => state.uploadedVideo)
  const setUploadedVideo = useAppStore((state) => state.setUploadedVideo)

  if (uploadedVideo.videoSource) return null

  return isLessThan100MB(uploadedVideo.file?.size) ? (
    <div className="flex items-start">
      <div className="px-3 py-1 text-sm border-l-4 opacity-60">
        This video size is less than 100MB and can be uploaded to IPFS for free,
        would you like to proceed?
      </div>
      <div className="pt-0.5">
        {uploadedVideo.isUploadToIpfs ? (
          <Tooltip content="Click to revert" placement="top">
            <button
              type="button"
              onClick={() => setUploadedVideo({ isUploadToIpfs: false })}
              className="ml-2 text-green-500 outline-none"
            >
              <BiCheck />
            </button>
          </Tooltip>
        ) : (
          <button
            type="button"
            onClick={() => setUploadedVideo({ isUploadToIpfs: true })}
            className="ml-2 text-sm text-indigo-500 outline-none"
          >
            Yes
          </button>
        )}
      </div>
    </div>
  ) : (
    <span className="p-2 text-sm border-l-4 opacity-60">
      This video will be uploaded to Arweave permanent storage.
    </span>
  )
}

export default UploadMethod
