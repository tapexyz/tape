import NetInfo from '@react-native-community/netinfo'
import { useEffect, useState } from 'react'

export const useIsOnline = () => {
  const [isOnline, setIsOnline] = useState(true)
  useEffect(() => {
    NetInfo.fetch().then((info) => {
      if (typeof info.isInternetReachable === 'boolean') {
        setIsOnline(info.isInternetReachable)
      }
    })

    const unsubscribe = NetInfo.addEventListener((info) => {
      if (typeof info.isInternetReachable === 'boolean') {
        setIsOnline(info.isInternetReachable)
      }
    })

    return unsubscribe
  }, [])

  return {
    isOnline
  }
}
