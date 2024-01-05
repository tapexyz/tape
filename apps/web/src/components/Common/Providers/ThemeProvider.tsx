import '@radix-ui/themes/styles.css'

import { Theme } from '@radix-ui/themes'
import { ThemeProvider as NextTheme } from 'next-themes'
import { type FC, type ReactNode } from 'react'

type Props = {
  children: ReactNode
}

const ThemeProvider: FC<Props> = ({ children }) => {
  return (
    <NextTheme
      defaultTheme="light"
      attribute="class"
      enableSystem
      enableColorScheme
    >
      <Theme accentColor="gray" radius="large" hasBackground={false}>
        {children}
      </Theme>
    </NextTheme>
  )
}

export default ThemeProvider
