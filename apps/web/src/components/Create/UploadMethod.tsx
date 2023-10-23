import useAppStore from '@lib/store'
import { Trans } from '@lingui/macro'
import { Text } from '@radix-ui/themes'
import { IPFS_FREE_UPLOAD_LIMIT } from '@tape.xyz/constants'
import { canUploadedToIpfs, formatMB } from '@tape.xyz/generic'
import React, { useEffect } from 'react'

import IrysInfo from './IrysInfo'

const UploadMethod = () => {
  const uploadedVideo = useAppStore((state) => state.uploadedVideo)
  const setUploadedVideo = useAppStore((state) => state.setUploadedVideo)

  const isUnderFreeLimit = canUploadedToIpfs(uploadedVideo.file?.size)

  useEffect(() => {
    if (!isUnderFreeLimit) {
      setUploadedVideo({ isUploadToIpfs: false })
    }
  }, [isUnderFreeLimit, setUploadedVideo])

  if (isUnderFreeLimit) {
    return null
  }

  return (
    <div className="pt-4">
      <Text weight="medium">
        <Trans>
          Please note that your media exceeds the free limit (
          {formatMB(IPFS_FREE_UPLOAD_LIMIT)}), and you can proceed with the
          upload by paying the storage fee.
        </Trans>
      </Text>
      <IrysInfo />
    </div>
  )
}

export default UploadMethod
