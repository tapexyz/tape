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
      {children}
    </NextTheme>
  )
}

export default ThemeProvider
