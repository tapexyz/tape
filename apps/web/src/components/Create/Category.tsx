import useAppStore from '@lib/store'
import { Trans } from '@lingui/macro'
import { Select, Text } from '@radix-ui/themes'
import { CREATOR_VIDEO_CATEGORIES } from '@tape.xyz/constants'
import { getCategoryByTag } from '@tape.xyz/generic'
import React from 'react'

const Category = () => {
  const uploadedVideo = useAppStore((state) => state.uploadedVideo)
  const setUploadedVideo = useAppStore((state) => state.setUploadedVideo)

  return (
    <div className="flex-1 space-y-1">
      <Text size="2" weight="medium">
        <Trans>Select Category</Trans>
      </Text>

      <Select.Root
        size="3"
        value={uploadedVideo.videoCategory.tag}
        onValueChange={(tag) =>
          setUploadedVideo({ videoCategory: getCategoryByTag(tag) })
        }
      >
        <Select.Trigger className="w-full" />
        <Select.Content highContrast>
          {CREATOR_VIDEO_CATEGORIES.map((category) => (
            <Select.Item key={category.tag} value={category.tag}>
              {category.name}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
    </div>
  )
}

export default Category
