import { IMAGEKIT_URL } from '@utils/constants'

const imageCdn = (url: string): string => {
  return `${IMAGEKIT_URL}/${url}`
}

export default imageCdn
