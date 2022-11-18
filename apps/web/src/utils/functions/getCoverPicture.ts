import { STATIC_ASSETS } from '@utils/constants'
import type { Profile } from 'src/types/lens'

const getCoverPicture = (channel: Profile): string => {
  return (
    // @ts-ignore
    channel?.coverPicture?.original?.url ??
    `${STATIC_ASSETS}/images/coverGradient.jpeg`
  )
}

export default getCoverPicture
