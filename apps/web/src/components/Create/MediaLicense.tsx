import { MetadataLicenseType } from '@lens-protocol/metadata'
import useAppStore from '@lib/store'
import { Select, SelectItem } from '@tape.xyz/ui'
import React from 'react'

const MediaLicense = () => {
  const uploadedMedia = useAppStore((state) => state.uploadedMedia)
  const setUploadedMedia = useAppStore((state) => state.setUploadedMedia)

  return (
    <div className="flex-1 space-y-1">
      <span className="text-sm font-medium">License</span>
      <Select
        value={uploadedMedia.mediaLicense}
        onValueChange={(mediaLicense: MetadataLicenseType) =>
          setUploadedMedia({ mediaLicense })
        }
      >
        <SelectItem value={MetadataLicenseType.CC_BY}>
          Creative Commons With Attribution
        </SelectItem>
        <SelectItem value={MetadataLicenseType.CC_BY_ND}>
          Creative Commons With Attribution - No Derivatives
        </SelectItem>
        <SelectItem value={MetadataLicenseType.CC_BY_NC}>
          Creative Commons With Attribution - Not for Commercial use
        </SelectItem>
        <SelectItem value={MetadataLicenseType.CCO}>
          No Rights Reserved
        </SelectItem>
      </Select>
    </div>
  )
}

export default MediaLicense
