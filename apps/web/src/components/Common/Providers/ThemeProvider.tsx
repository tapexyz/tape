'use client'

import '@radix-ui/themes/styles.css'

import { Theme } from '@radix-ui/themes'
import { useScreenSize } from '@tape.xyz/browser'
import { ThemeProvider as NextTheme } from 'next-themes'
import { type FC, type ReactNode } from 'react'

type Props = {
  children: ReactNode
}

const ThemeProvider: FC<Props> = ({ children }) => {
  const { isMobile, isTablet } = useScreenSize()
  return (
    <NextTheme defaultTheme="dark" attribute="class">
      <Theme
        accentColor="gray"
        scaling={isMobile ? '90%' : isTablet ? '95%' : '100%'}
        radius="large"
      >
        {children}
      </Theme>
    </NextTheme>
  )
}

export default ThemeProvider
