import Tooltip from '@components/UIElements/Tooltip'
import { Tab } from '@headlessui/react'
import useAppStore from '@lib/store'
import clsx from 'clsx'
import React, { useEffect } from 'react'
import { IPFS_FREE_UPLOAD_LIMIT } from 'utils'
import canUploadedToIpfs from 'utils/functions/canUploadedToIpfs'

import BundlrInfo from './BundlrInfo'

const UploadMethod = () => {
  const uploadedVideo = useAppStore((state) => state.uploadedVideo)
  const setUploadedVideo = useAppStore((state) => state.setUploadedVideo)

  const isUnderFreeLimit = canUploadedToIpfs(uploadedVideo.file?.size)

  const onClickArweave = async () => {
    setUploadedVideo({ isUploadToIpfs: false })
  }

  useEffect(() => {
    if (isUnderFreeLimit && !uploadedVideo.isUploadToIpfs) {
      setUploadedVideo({ isUploadToIpfs: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Tab.Group
      as="div"
      className="mt-4"
      defaultIndex={isUnderFreeLimit ? 1 : 0}
    >
      <Tab.List className="flex space-x-1 rounded-xl bg-gray-200 dark:bg-gray-800 p-1">
        <Tab
          className={({ selected }) =>
            clsx(
              'w-full rounded-xl py-2.5 text-sm font-medium leading-5 focus:outline-none',
              selected ? 'bg-white dark:bg-theme' : 'hover:bg-white/[0.12]'
            )
          }
          onClick={onClickArweave}
        >
          Upload to Arweave
        </Tab>
        <Tab
          className={({ selected }) =>
            clsx(
              'w-full rounded-xl disabled:opacity-30 text-sm font-medium leading-5 focus:outline-none',
              selected
                ? 'bg-white dark:bg-theme'
                : 'enabled:hover:bg-white/[0.12]'
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
}

export default UploadMethod
