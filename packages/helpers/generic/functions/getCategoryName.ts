import { CREATOR_VIDEO_CATEGORIES } from '@tape.xyz/constants'

export const getCategoryName = (tag: string) => {
  if (!tag) {
    return null
  }
  return CREATOR_VIDEO_CATEGORIES.find((c) => c.tag === tag)?.name
}

export const getCategoryByTag = (tag: string) => {
  return CREATOR_VIDEO_CATEGORIES.find(
    (c) => c.tag === tag
  ) as (typeof CREATOR_VIDEO_CATEGORIES)[0]
}
