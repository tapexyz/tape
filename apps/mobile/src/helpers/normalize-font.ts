import { PixelRatio, Platform } from 'react-native'

import { windowWidth } from './theme'

// based on iphone 5s's scale
const scale = windowWidth / 320

const normalizeFont = (size: number) => {
  const newSize = size * scale
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize))
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
  }
}

export default normalizeFont
