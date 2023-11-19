import { IPFS_FREE_UPLOAD_LIMIT } from '@dragverse/constants'
import { canUploadedToIpfs, formatMB } from '@dragverse/generic'
import useAppStore from '@lib/store'
import { Text } from '@radix-ui/themes'
import { useEffect } from 'react'

import IrysInfo from './IrysInfo'

const UploadMethod = () => {
  const uploadedMedia = useAppStore((state) => state.uploadedMedia)
  const setUploadedMedia = useAppStore((state) => state.setUploadedMedia)

  const isUnderFreeLimit = canUploadedToIpfs(uploadedMedia.file?.size)

  useEffect(() => {
    if (!isUnderFreeLimit) {
      setUploadedMedia({ isUploadToIpfs: false })
    }
  }, [isUnderFreeLimit, setUploadedMedia])

  if (isUnderFreeLimit) {
    return null
  }

  return (
    <div className="pt-4">
      <Text weight="medium">
        Please note that your media exceeds the free limit (
        {formatMB(IPFS_FREE_UPLOAD_LIMIT)}), and you can proceed with the upload
        by paying the storage fee.
      </Text>
      <IrysInfo />
    </div>
  )
}

export default UploadMethod
