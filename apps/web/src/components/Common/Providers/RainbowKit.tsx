import { LENSTUBE_APP_NAME, LENSTUBE_WEBSITE_URL } from '@lenstube/constants'
import type { Chain } from '@rainbow-me/rainbowkit'
import {
  darkTheme,
  lightTheme,
  RainbowKitProvider
} from '@rainbow-me/rainbowkit'
import type { ThemeOptions } from '@rainbow-me/rainbowkit/dist/themes/baseTheme'
import { useTheme } from 'next-themes'
import type { FC, ReactNode } from 'react'
import React from 'react'

type Props = {
  children: ReactNode
  chains: Chain[]
}

const Disclaimer = () => (
  <div className="prose-sm prose-a:text-indigo-500 text-[11px]">
    <span>By connecting, you acknowledge and agree to the Lenstube's</span>{' '}
    <a href="/terms" target="_blank">
      terms
    </a>{' '}
    <span>and</span>{' '}
    <a href="/privacy" target="_blank">
      privacy policy
    </a>
    .
  </div>
)

const RainbowKit: FC<Props> = ({ chains, children }) => {
  const { theme } = useTheme()
  const themeOptions: ThemeOptions = {
    fontStack: 'system',
    overlayBlur: 'small',
    accentColor: '#6366f1',
    borderRadius: 'medium'
  }
  return (
    <RainbowKitProvider
      appInfo={{
        appName: LENSTUBE_APP_NAME,
        learnMoreUrl: LENSTUBE_WEBSITE_URL,
        disclaimer: () => <Disclaimer />
      }}
      modalSize="compact"
      chains={chains}
      theme={
        theme === 'dark' ? darkTheme(themeOptions) : lightTheme(themeOptions)
      }
    >
      {children}
    </RainbowKitProvider>
  )
}

export default RainbowKit
