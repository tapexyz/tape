import InfoOutline from '@components/Common/Icons/InfoOutline'
import { MetadataLicenseType } from '@lens-protocol/metadata'
import useAppStore from '@lib/store'
import { Flex, HoverCard, Select, Text } from '@radix-ui/themes'
import { TAPE_APP_NAME } from '@tape.xyz/constants'
import Link from 'next/link'
import React from 'react'

const MediaLicense = () => {
  const uploadedMedia = useAppStore((state) => state.uploadedMedia)
  const setUploadedMedia = useAppStore((state) => state.setUploadedMedia)

  return (
    <div className="flex-1 space-y-1">
      <Flex gap="1" align="center">
        <Text size="2" weight="medium">
          License
        </Text>
        <HoverCard.Root>
          <HoverCard.Trigger>
            <span>
              <InfoOutline className="h-3 w-3" />
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
      </Flex>
      <Select.Root
        value={uploadedMedia.mediaLicense}
        onValueChange={(mediaLicense: MetadataLicenseType) =>
          setUploadedMedia({ mediaLicense })
        }
      >
        <Select.Trigger className="w-full" />
        <Select.Content highContrast>
          <Select.Item value={MetadataLicenseType.CC_BY}>
            Creative Commons With Attribution
          </Select.Item>
          <Select.Item value={MetadataLicenseType.CC_BY_ND}>
            Creative Commons With Attribution - No Derivatives
          </Select.Item>
          <Select.Item value={MetadataLicenseType.CC_BY_NC}>
            Creative Commons With Attribution - Not for Commercial use
          </Select.Item>
          <Select.Item value={MetadataLicenseType.CCO}>
            No Rights Reserved
          </Select.Item>
        </Select.Content>
      </Select.Root>
    </div>
  )
}

export default MediaLicense
