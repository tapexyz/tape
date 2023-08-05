import React from 'react'
import { Text, View } from 'react-native'
import {
  createNotifications,
  ZoomInDownZoomOutUp
} from 'react-native-notificated'
import type { NotificationProps } from 'react-native-notificated/lib/typescript/defaultConfig/types'

import { theme, windowWidth } from '~/helpers/theme'

type Variant = 'success' | 'warning' | 'error' | 'info'

const getEmoji = (variant: Variant) => {
  switch (variant) {
    case 'success':
      return '🎉'
    case 'error':
      return '💢'
    case 'info':
      return '🐨'
    case 'warning':
      return '🚧'
    default:
      break
  }
}

const getBorderColor = (variant: Variant) => {
  switch (variant) {
    case 'success':
      return theme.colors.green
    case 'error':
      return theme.colors.red
    case 'info':
      return theme.colors.grey
    case 'warning':
      return theme.colors.yellow
    default:
      return theme.colors.grey
  }
}

const NotificationComponent = (
  props: NotificationProps & {
    variant: Variant
  }
) => (
  <View
    style={{
      width: windowWidth,
      flexDirection: 'row',
      justifyContent: 'center'
    }}
  >
    <View
      style={{
        backgroundColor: theme.colors.black,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 100,
        alignItems: 'baseline',
        borderColor: getBorderColor(props.variant),
        borderWidth: 0.3
      }}
    >
      <View style={{ gap: 10, flexDirection: 'row' }}>
        <Text style={{ color: theme.colors.white }}>{props.title}</Text>
        <Text>{getEmoji(props.variant)}</Text>
      </View>
    </View>
  </View>
)

export const { NotificationsProvider } = createNotifications({
  duration: 3000,
  gestureConfig: {
    direction: 'full',
    x: { activationDistances: 50, activationVelocities: 200 },
    y: { activationDistances: 50, activationVelocities: 200 }
  },
  animationConfig: ZoomInDownZoomOutUp,
  variants: {
    success: {
      component: (props) => (
        <NotificationComponent {...props} variant="success" />
      )
    },
    warning: {
      component: (props) => (
        <NotificationComponent {...props} variant="warning" />
      )
    },
    error: {
      component: (props) => <NotificationComponent {...props} variant="error" />
    },
    info: {
      component: (props) => <NotificationComponent {...props} variant="info" />
    }
  },
  defaultStylesSettings: {
    globalConfig: {
      defaultIconType: 'no-icon',
      borderType: 'no-border',
      borderRadius: 1000,
      bgColor: theme.colors.background
    },
    darkMode: true
  }
})
