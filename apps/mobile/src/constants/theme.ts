import type { Theme } from '@react-navigation/native'

const commonColors = {
  primary: {
    50: '#e9eeff',
    100: '#c4ccf0',
    200: '#9faae1',
    300: '#7a88d2',
    400: '#5566c4',
    500: '#3b4caa',
    600: '#2d3b85',
    700: '#1f2a61',
    800: '#11193d',
    900: '#05071a'
  },
  secondary: {
    50: '#ffe1f1',
    100: '#ffb1cf',
    200: '#ff7ead',
    300: '#ff4c8c',
    400: '#ff1a6b',
    500: '#e60051',
    600: '#b4003f',
    700: '#82002d',
    800: '#50001a',
    900: '#21000a'
  },
  background: '#000000',
  border: '#000',
  card: '#fff',
  notification: '#000',
  gradient: {
    from: '#111827',
    to: '#000000'
  }
}

export const theme = {
  colors: commonColors,
  shadows: {
    inputShadow: {
      shadowOffset: { width: 0, height: 2 },
      shadowColor: commonColors.primary['500'],
      shadowOpacity: 0.16,
      elevation: 3
    }
  }
}

export const navigationTheme: Theme = {
  colors: {
    background: '#000000',
    border: '#000000',
    card: '#111827',
    notification: 'red',
    primary: '#fff',
    text: '#fff'
  },
  dark: true
}
