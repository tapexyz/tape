import type { Metadata } from 'next'

import common from '@/common'

export const metadata: Metadata = common

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

export default RootLayout
