import Tooltip from '@components/UIElements/Tooltip'
import { Tab } from '@headlessui/react'
import useAppStore from '@lib/store'
import { Trans } from '@lingui/macro'
import clsx from 'clsx'
import React from 'react'
import { IPFS_FREE_UPLOAD_LIMIT } from 'utils'
import canUploadedToIpfs from 'utils/functions/canUploadedToIpfs'

import BundlrInfo from './BundlrInfo'

const UploadMethod = () => {
  const uploadedVideo = useAppStore((state) => state.uploadedVideo)
  const setUploadedVideo = useAppStore((state) => state.setUploadedVideo)

  const isUnderFreeLimit = canUploadedToIpfs(uploadedVideo.file?.size)

  return (
    <Tab.Group
      as="div"
      className="mt-4"
      defaultIndex={isUnderFreeLimit ? 1 : 0}
    >
      <Tab.List className="flex space-x-1 rounded-xl bg-gray-200 p-1 dark:bg-gray-800">
        <Tab
          className={({ selected }) =>
            clsx(
              'w-full rounded-xl py-2.5 text-sm font-medium leading-5 focus:outline-none',
              selected ? 'dark:bg-theme bg-white' : 'hover:bg-white/[0.12]'
            )
          }
          onClick={() => setUploadedVideo({ isUploadToIpfs: false })}
        >
          <Trans>Upload to Arweave</Trans>
        </Tab>
        <Tab
          className={({ selected }) =>
            clsx(
              'w-full rounded-xl text-sm font-medium leading-5 focus:outline-none disabled:opacity-30',
              selected
                ? 'dark:bg-theme bg-white'
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
              <Trans>Upload to IPFS</Trans>
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
