import Constants from 'expo-constants'
import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'
import { useEffect, useRef, useState } from 'react'
import { Platform } from 'react-native'

const registerForPushNotificationsAsync = async () => {
  let token = ''
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!')
      return
    }
    token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas.projectId
      })
    ).data
  } else {
    alert('Must use physical device for Push Notifications')
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C'
    })
  }

  return token
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false
  })
})

export const usePushNotifications = () => {
  const [expoPushToken, setExpoPushToken] = useState('')
  const [notification, setNotification] = useState<Notifications.Notification>()
  const notificationListener = useRef<Notifications.Subscription>()
  const responseListener = useRef<Notifications.Subscription>()

  const initNotificationListener = () => {
    registerForPushNotificationsAsync().then((token) => {
      return setExpoPushToken(token ?? '')
    })

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification)
      })

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(
          '🚀 ~ file: usePushNotifications.ts ~ Notifications.addNotificationResponseReceivedListener ~ response:',
          response
        )
      })
  }
  const removeNotificationListener = () => {
    if (!notificationListener.current || !responseListener.current) {
      return
    }
    Notifications.removeNotificationSubscription(notificationListener.current)
    Notifications.removeNotificationSubscription(responseListener.current)
  }

  useEffect(() => {
    initNotificationListener()

    return () => {
      removeNotificationListener()
    }
  }, [])

  return {
    expoPushToken,
    notification
  }
}
