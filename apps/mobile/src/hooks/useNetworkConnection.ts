import { useEffect } from 'react'
import { useNotifications } from 'react-native-notificated'

import { useIsForeground } from './useIsForeground'
import { useIsOnline } from './useIsOnline'

export const useNetWorkConnection = () => {
  const isForeground = useIsForeground()
  const { isOnline } = useIsOnline()
  const { notify } = useNotifications()

  useEffect(() => {
    const getNetwork = async () => {
      if (isOnline) {
        return
      }
      notify('info', { params: { title: 'No internet connection' } })
    }
    getNetwork()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isForeground, isOnline])
}
