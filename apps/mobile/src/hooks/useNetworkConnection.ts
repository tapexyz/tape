import { useEffect } from 'react'

import { useIsForeground } from './useIsForeground'
import { useIsOnline } from './useIsOnline'

export const useNetWorkConnection = () => {
  const isForeground = useIsForeground()
  const { isOnline } = useIsOnline()

  const getNetwork = async () => {
    if (isOnline || !isForeground) {
      return
    }
  }

  useEffect(() => {
    getNetwork().finally(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isForeground, isOnline])
}
