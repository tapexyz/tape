import type { ThemeConfig } from '@livepeer/react'
import { createReactClient, studioProvider } from '@livepeer/react'

import { LIVEPEER_STUDIO_API_KEY } from '../constants'

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
    progressLeft: '#6366f1',
    loading: '#6366f1'
  },
  fonts: {
    display: 'system-ui'
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
    thumbActive: '7px',
    trackActive: '3px',
    trackInactive: '3px'
  },
  radii: {
    containerBorderRadius: '0px'
  }
}
