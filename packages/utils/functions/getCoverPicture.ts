import type { Profile } from 'lens'

import { STATIC_ASSETS } from '../constants'

const getCoverPicture = (channel: Profile): string => {
  return (
    // @ts-ignore
    channel?.coverPicture?.original?.url ??
    `${STATIC_ASSETS}/images/coverGradient.jpeg`
  )
}

export default getCoverPicture
