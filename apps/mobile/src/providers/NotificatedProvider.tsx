import { createNotifications } from 'react-native-notificated'

export const { NotificationsProvider } = createNotifications({
  duration: 3000,
  defaultStylesSettings: {
    globalConfig: {
      defaultIconType: 'monochromatic',
      borderWidth: 0,
      borderRadius: 20
    }
  }
})
