import type { ThemeConfig } from '@livepeer/react'
import { createReactClient, studioProvider } from '@livepeer/react'
import { LIVEPEER_STUDIO_API_KEY } from '@tape.xyz/constants'

export const getLivepeerClient = () => {
  return createReactClient({
    provider: studioProvider({
      apiKey: LIVEPEER_STUDIO_API_KEY
    })
  })
}

export const videoPlayerTheme: ThemeConfig = {
  colors: {
    accent: '#fff',
    progressLeft: '#39C4FF',
    loading: '#39C4FF'
  },
  fontSizes: {
    timeFontSize: '12px'
  },
  space: {
    timeMarginX: '22px',
    controlsBottomMarginX: '10px',
    controlsBottomMarginY: '10px'
  },
  sizes: {
    iconButtonSize: '35px',
    loading: '30px',
    thumb: '7px',
    trackInactive: '3px',
    thumbActive: '10px',
    trackActive: '5px'
  },
  radii: {
    containerBorderRadius: '0px'
  }
}
