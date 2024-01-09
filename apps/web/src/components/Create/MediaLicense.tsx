import { MetadataLicenseType } from '@lens-protocol/metadata'
import useAppStore from '@lib/store'
import { HoverCard } from '@radix-ui/themes'
import { TAPE_APP_NAME } from '@tape.xyz/constants'
import { InfoOutline, Select, SelectItem } from '@tape.xyz/ui'
import Link from 'next/link'
import React from 'react'

const MediaLicense = () => {
  const uploadedMedia = useAppStore((state) => state.uploadedMedia)
  const setUploadedMedia = useAppStore((state) => state.setUploadedMedia)

  return (
    <div className="flex-1 space-y-1">
      <div className="flex items-center gap-1">
        <span className="text-sm font-medium">License</span>
        <HoverCard.Root>
          <HoverCard.Trigger>
            <span>
              <InfoOutline className="size-3" />
            </span>
          </HoverCard.Trigger>
          <HoverCard.Content>
            <span>
              Learn more about{' '}
              <Link
                href={`https://creativecommons.org/licenses/?utm_source=${TAPE_APP_NAME}`}
                target="_blank"
                className="text-brand-500"
              >
                creative common licenses
              </Link>
            </span>
          </HoverCard.Content>
        </HoverCard.Root>
      </div>
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
