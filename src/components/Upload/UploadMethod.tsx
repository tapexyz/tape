import Tooltip from '@components/UIElements/Tooltip'
import { Tab } from '@headlessui/react'
import useAppStore from '@lib/store'
import { IPFS_FREE_UPLOAD_LIMIT } from '@utils/constants'
import canUploadedToIpfs from '@utils/functions/canUploadedToIpfs'
import clsx from 'clsx'
import React, { useEffect } from 'react'
import toast from 'react-hot-toast'
import { useAccount, useSigner } from 'wagmi'

import BundlrInfo from './BundlrInfo'

const UploadMethod = () => {
  const uploadedVideo = useAppStore((state) => state.uploadedVideo)
  const bundlrData = useAppStore((state) => state.bundlrData)
  const getBundlrInstance = useAppStore((state) => state.getBundlrInstance)
  const setBundlrData = useAppStore((state) => state.setBundlrData)
  const setUploadedVideo = useAppStore((state) => state.setUploadedVideo)

  const { address } = useAccount()
  const { data: signer } = useSigner()

  const isUnderFreeLimit = canUploadedToIpfs(uploadedVideo.file?.size)

  const initBundlr = async () => {
    if (signer?.provider && address && !bundlrData.instance) {
      toast('Initializing & Estimating upload cost...')
      const bundlr = await getBundlrInstance(signer)
      if (bundlr) {
        setBundlrData({ instance: bundlr })
      }
      setUploadedVideo({ isUploadToIpfs: false })
    }
  }

  useEffect(() => {
    if (isUnderFreeLimit && !uploadedVideo.isUploadToIpfs) {
      setUploadedVideo({ isUploadToIpfs: true })
    }
  }, [
    uploadedVideo.file?.size,
    setUploadedVideo,
    uploadedVideo,
    isUnderFreeLimit
  ])

  return (
    <Tab.Group
      as="div"
      className="mt-4"
      defaultIndex={isUnderFreeLimit ? 1 : 0}
    >
      <Tab.List className="flex space-x-1 rounded-xl bg-gray-100 dark:bg-gray-800 p-1">
        <Tab
          className={({ selected }) =>
            clsx(
              'w-full rounded-xl py-2.5 text-sm font-medium leading-5 focus:outline-none',
              selected ? 'bg-white dark:bg-black' : 'hover:bg-white/[0.5]'
            )
          }
          onClick={initBundlr}
        >
          Upload to Arweave
        </Tab>
        <Tab
          className={({ selected }) =>
            clsx(
              'w-full rounded-xl disabled:opacity-30 text-sm font-medium leading-5 focus:outline-none',
              selected ? 'bg-white' : 'enabled:hover:bg-white/[0.5]'
            )
          }
          onClick={() => setUploadedVideo({ isUploadToIpfs: true })}
          disabled={!isUnderFreeLimit}
        >
          <Tooltip
            visible={!isUnderFreeLimit}
            content={`Video size under ${IPFS_FREE_UPLOAD_LIMIT}mb can be uploaded to IPFS for free`}
            placement="top-end"
          >
            <div className="py-2.5">
              Upload to IPFS ({IPFS_FREE_UPLOAD_LIMIT}mb)
            </div>
          </Tooltip>
        </Tab>
      </Tab.List>
      <Tab.Panels>
        <Tab.Panel className="focus:outline-none">
          {!uploadedVideo.isUploadToIpfs && <BundlrInfo />}
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  )
  // return canUploadedToIpfs(uploadedVideo.file?.size) ? (
  //   <div className="flex items-start mt-4">
  //     <div className="px-3 py-1 text-sm border-l-4 opacity-60">
  //       This video size is less than {IPFS_FREE_UPLOAD_LIMIT}MB and can be
  //       uploaded to IPFS for free, would you like to proceed?
  //     </div>
  //     <div className="pt-0.5">
  //       {uploadedVideo.isUploadToIpfs ? (
  //         <Tooltip content="Click to revert" placement="top">
  //           <button
  //             type="button"
  //             onClick={() => setUploadedVideo({ isUploadToIpfs: false })}
  //             className="ml-2 text-green-500 outline-none"
  //           >
  //             <BiCheck />
  //           </button>
  //         </Tooltip>
  //       ) : (
  //         <button
  //           type="button"
  //           onClick={() => setUploadedVideo({ isUploadToIpfs: true })}
  //           className="ml-2 text-sm text-indigo-500 outline-none"
  //         >
  //           Yes
  //         </button>
  //       )}
  //     </div>
  //   </div>
  // ) : (
  //   <span className="p-2 text-sm border-l-4 opacity-60">
  //     This video will be uploaded to Arweave permanent storage.
  //   </span>
  // )
}

export default UploadMethod
