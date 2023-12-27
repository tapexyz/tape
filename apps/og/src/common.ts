import {
  OG_IMAGE,
  TAPE_APP_DESCRIPTION,
  TAPE_APP_NAME,
  TAPE_WEBSITE_URL
} from '@tape.xyz/constants'
import type { Metadata } from 'next'

const common: Metadata = {
  title: TAPE_APP_NAME,
  description: TAPE_APP_DESCRIPTION,
  metadataBase: new URL(TAPE_WEBSITE_URL),
  openGraph: {
    type: 'website',
    siteName: TAPE_APP_NAME,
    images: [OG_IMAGE],
    title: TAPE_APP_NAME,
    description: TAPE_APP_DESCRIPTION,
    url: new URL(TAPE_WEBSITE_URL)
  },
  twitter: {
    card: 'summary_large_image',
    title: TAPE_APP_NAME,
    description: TAPE_APP_DESCRIPTION,
    images: [OG_IMAGE]
  }
}

export default common
