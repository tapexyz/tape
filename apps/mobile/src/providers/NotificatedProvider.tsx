import { createNotifications } from 'react-native-notificated'

export const { NotificationsProvider } = createNotifications({
  isNotch: true,
  duration: 5000,
  defaultStylesSettings: {
    globalConfig: {
      defaultIconType: 'no-icon'
    }
  }
})
