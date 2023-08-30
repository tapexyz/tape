import type { MobileThemeConfig } from '@lenstube/lens/custom-types'
import { Dimensions } from 'react-native'

export const { width: windowWidth, height: windowHeight } =
  Dimensions.get('window')

export const colors = {
  secondary: '#ffffff90',
  background: '#000000',
  backdrop: '#12131A',
  backdrop2: '#1E2028',
  border: '#000',
  card: '#ffffff',
  notification: '#000',
  black: '#000000',
  white: '#ffffff',
  red: 'red',
  yellow: '#FEFF55',
  green: 'green',
  grey: '#333333',
  blueGrey: '#E0E8FF',
  indigo: '#6366f1'
}

const darkTheme: MobileThemeConfig = {
  textColor: colors.white,
  secondaryTextColor: colors.secondary,
  backgroudColor: colors.black,
  backgroudColor2: colors.backdrop,
  backgroudColor3: colors.backdrop2,
  sheetBackgroundColor: colors.backdrop,
  borderColor: colors.grey,
  contrastBorderColor: colors.white,
  sheetBorderColor: colors.grey,
  contrastBackgroundColor: colors.white,
  contrastTextColor: colors.black
}

const lightTheme: MobileThemeConfig = {
  textColor: colors.black,
  secondaryTextColor: '#00000090',
  backgroudColor: colors.white,
  backgroudColor2: '#F0F2F5',
  backgroudColor3: '#AAB2BD',
  sheetBackgroundColor: '#F0F2F5',
  borderColor: '#CCCCCC',
  contrastBorderColor: colors.black,
  sheetBorderColor: '#CCCCCC',
  contrastBackgroundColor: colors.black,
  contrastTextColor: colors.white
}

export const theme = {
  dark: darkTheme,
  light: lightTheme
}
