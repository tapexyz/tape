import {
  IMAGE_TRANSFORMATIONS,
  LENS_IMAGEKIT_SNAPSHOT_URL
} from '@lenstube/constants'

const imageCdn = (
  url: string,
  type?: keyof typeof IMAGE_TRANSFORMATIONS
): string => {
  if (!url) {
    return url
  }

  if (url.includes(LENS_IMAGEKIT_SNAPSHOT_URL)) {
    const splitedUrl = url.split('/')
    const path = splitedUrl[splitedUrl.length - 1]

    return type
      ? `${LENS_IMAGEKIT_SNAPSHOT_URL}/${IMAGE_TRANSFORMATIONS[type]}/${path}`
      : url
  }

  return url
}

export default imageCdn
