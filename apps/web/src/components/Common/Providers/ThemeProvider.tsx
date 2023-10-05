'use client'

import '@radix-ui/themes/styles.css'

import { Theme } from '@radix-ui/themes'
import { ThemeProvider as NextTheme } from 'next-themes'
import { type FC, type ReactNode } from 'react'

type Props = {
  children: ReactNode
}

const ThemeProvider: FC<Props> = ({ children }) => {
  return (
    <NextTheme defaultTheme="light" attribute="class">
      <Theme accentColor="gray" radius="large" panelBackground="solid">
        {children}
      </Theme>
    </NextTheme>
  )
}

export default ThemeProvider
