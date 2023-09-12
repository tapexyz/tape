import type { MobileThemeConfig } from '@lenstube/lens/custom-types'
import { Dimensions } from 'react-native'

export const { width: windowWidth, height: windowHeight } =
  Dimensions.get('window')

export const colors = {
  secondary: '#dee2e6',
  background: '#000000',
  backdrop: '#12131A',
  backdrop2: '#1E2028',
  border: '#000',
  card: '#ffffff',
  notification: '#000',
  black: '#000000',
  white: '#ffffff',
  red: 'red',
  lightRed: '#ff8f8f',
  yellow: '#FEFF55',
  green: 'green',
  orange: 'orange',
  grey: '#333333',
  blueGrey: '#E0E8FF',
  indigo: '#6366f1',
  garden: '#404B42'
}

const darkTheme: MobileThemeConfig = {
  textColor: colors.white,
  secondaryTextColor: colors.secondary,
  backgroudColor: colors.black,
  backgroudColor2: colors.backdrop,
  backgroudColor3: colors.backdrop2,
  sheetBackgroundColor: colors.backdrop,
  borderColor: colors.grey,
  sheetBorderColor: colors.grey,
  contrastBorderColor: colors.white,
  contrastBackgroundColor: colors.white,
  contrastTextColor: colors.black,
  buttonBackgroundColor: colors.white,
  buttonTextColor: colors.black
}

const lightTheme: MobileThemeConfig = {
  textColor: colors.black,
  secondaryTextColor: '#00000090',
  backgroudColor: colors.white,
  backgroudColor2: '#F0F2F5',
  backgroudColor3: '#dfe2e6',
  sheetBackgroundColor: '#F0F2F5',
  borderColor: '#CCCCCC',
  sheetBorderColor: '#CCCCCC',
  contrastBorderColor: colors.black,
  contrastBackgroundColor: colors.black,
  contrastTextColor: colors.white,
  buttonBackgroundColor: colors.black,
  buttonTextColor: colors.white
}

const gardenTheme: MobileThemeConfig = {
  textColor: colors.garden,
  secondaryTextColor: '#00000090',
  backgroudColor: colors.white,
  backgroudColor2: '#F0F2F5',
  backgroudColor3: '#dfe2e6',
  sheetBackgroundColor: '#F0F2F5',
  borderColor: '#CCCCCC',
  sheetBorderColor: '#CCCCCC',
  contrastBorderColor: colors.black,
  contrastBackgroundColor: colors.black,
  contrastTextColor: colors.white,
  buttonBackgroundColor: '#404B42',
  buttonTextColor: colors.white
}

export const theme = {
  dark: darkTheme,
  light: lightTheme,
  garden: gardenTheme
}
