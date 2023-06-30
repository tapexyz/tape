import { useNavigation } from '@react-navigation/native'
import { useEffect } from 'react'
import { Alert } from 'react-native'

export const usePreventGoBack = (shouldPrevent = true): void => {
  const navigation = useNavigation()

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const callback = (event: any) => {
      if (!shouldPrevent) {
        return
      }

      event?.preventDefault()

      Alert.alert(
        'navigation.prevent_go_back_alert.title',
        'navigation.prevent_go_back_alert.description',
        [
          {
            text: 'navigation.prevent_go_back_alert.dont_leave',
            style: 'cancel',
            onPress: () => {}
          },
          {
            text: 'navigation.prevent_go_back_alert.discard',
            style: 'destructive',
            onPress: () => navigation.dispatch(event?.data?.action)
          }
        ]
      )
    }

    navigation.addListener('beforeRemove', callback)

    return () => navigation.removeListener('beforeRemove', callback)
  }, [navigation, shouldPrevent])
}
