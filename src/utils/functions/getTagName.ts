import { CREATOR_VIDEO_CATEGORIES } from '@utils/data/categories'

const getTagName = (tag: string) => {
  if (!tag) return null
  return CREATOR_VIDEO_CATEGORIES.find((c) => c.tag === tag)?.name
}
export default getTagName
