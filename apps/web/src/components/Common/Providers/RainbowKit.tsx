import type { Chain } from '@rainbow-me/rainbowkit'
import {
  darkTheme,
  lightTheme,
  RainbowKitProvider
} from '@rainbow-me/rainbowkit'
import type { ThemeOptions } from '@rainbow-me/rainbowkit/dist/themes/baseTheme'
import { TAPE_APP_NAME, TAPE_WEBSITE_URL } from '@tape.xyz/constants'
import { useTheme } from 'next-themes'
import type { FC, ReactNode } from 'react'
import React from 'react'

type Props = {
  children: ReactNode
  chains: Chain[]
}

const Disclaimer = () => (
  <div className="prose-sm prose-a:text-brand-500 text-[11px]">
    <span>
      By connecting, you acknowledge and agree to the {TAPE_APP_NAME}'s
    </span>{' '}
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
    accentColor: '#39c4ff',
    borderRadius: 'medium'
  }
  return (
    <RainbowKitProvider
      appInfo={{
        appName: TAPE_APP_NAME,
        learnMoreUrl: TAPE_WEBSITE_URL,
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
