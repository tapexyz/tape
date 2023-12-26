import useAppStore from '@lib/store'
import { Select, Text } from '@radix-ui/themes'
import { CREATOR_VIDEO_CATEGORIES } from '@tape.xyz/constants'
import { getCategoryByTag } from '@tape.xyz/generic'
import React from 'react'

const MediaCategory = () => {
  const uploadedMedia = useAppStore((state) => state.uploadedMedia)
  const setUploadedMedia = useAppStore((state) => state.setUploadedMedia)
  return (
    <div className="flex-1 space-y-1">
      <Text size="2" weight="medium">
        Category
      </Text>

      <Select.Root
        value={uploadedMedia.mediaCategory.tag}
        onValueChange={(tag) =>
          setUploadedMedia({ mediaCategory: getCategoryByTag(tag) })
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

export default MediaCategory
