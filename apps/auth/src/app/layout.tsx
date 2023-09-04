import './globals.css'

import {
  LENSTUBE_APP_DESCRIPTION,
  LENSTUBE_APP_NAME,
  STATIC_ASSETS
} from '@lenstube/constants'
import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'
import React from 'react'

export const metadata: Metadata = {
  title: LENSTUBE_APP_NAME,
  description: LENSTUBE_APP_DESCRIPTION
}

const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  preload: true
})

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="icon"
          href={`${STATIC_ASSETS}/images/favicons/favicon.ico`}
          type="image/x-icon"
        />
        <link
          rel="shortcut icon"
          href={`${STATIC_ASSETS}/images/favicons/favicon.ico`}
        />
      </head>
      <body className={`${dmSans.className} h-screen`}>{children}</body>
    </html>
  )
}
