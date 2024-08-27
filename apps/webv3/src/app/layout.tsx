import './globals.css'

import { TAPE_APP_DESCRIPTION, TAPE_APP_NAME } from '@tape.xyz/constants'
import type { Metadata } from 'next'
import Link from 'next/link'

import { Providers } from './providers'

export const metadata: Metadata = {
  title: TAPE_APP_NAME,
  description: TAPE_APP_DESCRIPTION
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <Link href="/">Home</Link>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
