import { Theme } from '@radix-ui/themes'
import '@radix-ui/themes/styles.css'
import { ThemeProvider as NextTheme } from 'next-themes'
import { type FC, type ReactNode } from 'react'

type Props = {
  children: ReactNode
}

const ThemeProvider: FC<Props> = ({ children }) => {
  return (
    <NextTheme attribute="class" defaultTheme="light">
      <Theme accentColor="gray" radius="large">
        {children}
      </Theme>
    </NextTheme>
  )
}

export default ThemeProvider
