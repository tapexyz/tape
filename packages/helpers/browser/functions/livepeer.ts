import { LIVEPEER_STUDIO_API_KEY } from '@lenstube/constants'
import type { ThemeConfig } from '@livepeer/react'
import { createReactClient, studioProvider } from '@livepeer/react'

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
