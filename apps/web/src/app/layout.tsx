import './globals.css'

import ThemeProvider from '@components/Common/Providers/ThemeProvider'
import {
  OG_IMAGE,
  STATIC_ASSETS,
  TAPE_APP_DESCRIPTION,
  TAPE_APP_NAME,
  TAPE_WEBSITE_URL,
  TAPE_X_HANDLE
} from '@tape.xyz/constants'
import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'

export const metadata: Metadata = {
  title: TAPE_APP_NAME,
  description: TAPE_APP_DESCRIPTION,
  robots: 'index, follow',
  viewport:
    'width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover',
  alternates: { canonical: TAPE_WEBSITE_URL, languages: { en: 'en' } },
  openGraph: {
    type: 'website',
    title: TAPE_APP_NAME,
    description: TAPE_APP_DESCRIPTION,
    url: TAPE_WEBSITE_URL,
    siteName: TAPE_APP_NAME,
    images: [{ url: OG_IMAGE, width: 400, height: 400 }]
  },
  twitter: {
    card: 'summary_large_image',
    images: [{ url: OG_IMAGE, width: 400, height: 400 }],
    site: TAPE_APP_NAME,
    title: TAPE_APP_NAME,
    description: TAPE_APP_DESCRIPTION,
    creator: TAPE_X_HANDLE
  },
  keywords: [
    'entertainment',
    'video creators',
    'music creators',
    'lens protocol',
    'nfts'
  ],
  icons: [
    { rel: 'icon', url: `${STATIC_ASSETS}/images/favicons/favicon.ico` },
    {
      rel: 'icon',
      url: `${STATIC_ASSETS}/images/favicons/favicon.ico`,
      type: 'image/x-icon'
    },
    {
      rel: 'icon',
      url: `${STATIC_ASSETS}/images/brand/lenstube.svg`,
      type: 'image/svg+xml'
    },
    {
      rel: 'shortcut icon',
      url: `${STATIC_ASSETS}/images/favicons/favicon.ico`
    },
    {
      rel: 'apple-touch-icon',
      url: `${STATIC_ASSETS}/images/favicons/apple-icon-180x180.png`,
      sizes: '180x180'
    },
    {
      rel: 'icon',
      type: 'image/png',
      url: `${STATIC_ASSETS}/images/favicons/favicon-32x32.png`,
      sizes: '32x32'
    },
    {
      rel: 'icon',
      type: 'image/png',
      url: `${STATIC_ASSETS}/images/favicons/favicon-16x16.png`,
      sizes: '16x16'
    },
    {
      rel: 'icon',
      type: 'image/png',
      url: `${STATIC_ASSETS}/images/favicons/apple-icon-57x57.png`,
      sizes: '57x57'
    },
    {
      rel: 'icon',
      type: 'image/png',
      url: `${STATIC_ASSETS}/images/favicons/apple-icon-60x60.png`,
      sizes: '60x60'
    },
    {
      rel: 'icon',
      type: 'image/png',
      url: `${STATIC_ASSETS}/images/favicons/apple-icon-72x72.png`,
      sizes: '72x72'
    },
    {
      rel: 'icon',
      type: 'image/png',
      url: `${STATIC_ASSETS}/images/favicons/apple-icon-76x76.png`,
      sizes: '76x76'
    },
    {
      rel: 'icon',
      type: 'image/png',
      url: `${STATIC_ASSETS}/images/favicons/apple-icon-96x96.png`,
      sizes: '96x96'
    },
    {
      rel: 'icon',
      type: 'image/png',
      url: `${STATIC_ASSETS}/images/favicons/apple-icon-152x152.png`,
      sizes: '152x152'
    },
    {
      rel: 'icon',
      type: 'image/png',
      url: `${STATIC_ASSETS}/images/favicons/apple-icon-144x144.png`,
      sizes: '144x144'
    },
    {
      rel: 'icon',
      type: 'image/png',
      url: `${STATIC_ASSETS}/images/favicons/apple-icon-120x120.png`,
      sizes: '120x120'
    },
    {
      rel: 'icon',
      type: 'image/png',
      url: `${STATIC_ASSETS}/images/favicons/apple-icon-114x114.png`,
      sizes: '114x114'
    },
    {
      rel: 'icon',
      type: 'image/png',
      url: `${STATIC_ASSETS}/images/favicons/android-icon-192x192.png`,
      sizes: '192x192'
    }
  ],
  manifest: `${STATIC_ASSETS}/images/favicons/manifest.json`,
  themeColor: '#000000'
}

const font = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap'
})

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" className={font.className}>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}

export default RootLayout
