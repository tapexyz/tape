import { useEffect } from 'react'
import { useNotifications } from 'react-native-notificated'

import { useIsForeground } from './useIsForeground'
import { useIsOnline } from './useIsOnline'

export const useNetWorkConnection = () => {
  const isForeground = useIsForeground()
  const { isOnline } = useIsOnline()
  const { notify } = useNotifications()

  const getNetwork = async () => {
    if (isOnline || !isForeground) {
      return
    }
    notify('warning', { params: { title: 'Internet disconnected' } })
  }

  useEffect(() => {
    getNetwork().finally(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isForeground, isOnline])
}
