import { CREATOR_VIDEO_CATEGORIES } from '@lenstube/constants'

export const getCategoryName = (tag: string) => {
  if (!tag) {
    return null
  }
  return CREATOR_VIDEO_CATEGORIES.find((c) => c.tag === tag)?.name
}
