import useAppStore from '@lib/store'
import useProfileStore from '@lib/store/idb/profile'
import { canUploadedToIpfs } from '@tape.xyz/generic'
import React, { useEffect } from 'react'

import IrysInfo from './IrysInfo'

const UploadMethod = () => {
  const uploadedMedia = useAppStore((state) => state.uploadedMedia)
  const setUploadedMedia = useAppStore((state) => state.setUploadedMedia)
  const activeProfile = useProfileStore((state) => state.activeProfile)

  const canUploadToIpfs = canUploadedToIpfs(
    uploadedMedia.file?.size || 0,
    activeProfile?.sponsor
  )

  useEffect(() => {
    if (!canUploadToIpfs) {
      setUploadedMedia({ isUploadToIpfs: false })
    }
  }, [canUploadToIpfs, setUploadedMedia])

  if (canUploadToIpfs) {
    return null
  }

  return (
    <div className="pt-4">
      <span className="font-medium">
        Your current upload exceeds the free limit, and to proceed with the
        upload, you may consider covering the storage fee.
      </span>
      <IrysInfo />
    </div>
  )
}

export default UploadMethod
