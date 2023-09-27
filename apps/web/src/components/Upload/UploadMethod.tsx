import { canUploadedToIpfs } from '@lenstube/generic'
import useAppStore from '@lib/store'
import { Trans } from '@lingui/macro'
import { Text } from '@radix-ui/themes'
import React, { useEffect } from 'react'

import BundlrInfo from './BundlrInfo'

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
          Please note that your media exceeds the free limit, and you can
          proceed with the upload by paying the storage fee.
        </Trans>
      </Text>
      <BundlrInfo />
    </div>
  )
}

export default UploadMethod
