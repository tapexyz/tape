import { Ionicons } from '@expo/vector-icons'
import * as Font from 'expo-font'
import { useEffect, useState } from 'react'

export const useCachedResources = (): boolean => {
  const [isLoadingComplete, setLoadingComplete] = useState(false)

  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        // Load fonts
        await Font.loadAsync({
          ...Ionicons.font,
          'font-normal': require('assets/fonts/Nunito-Regular.ttf'),
          'font-bold': require('assets/fonts/Nunito-Bold.ttf'),
          'font-extrabold': require('assets/fonts/Nunito-Black.ttf')
        })
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e)
      } finally {
        setLoadingComplete(true)
      }
    }

    loadResourcesAndDataAsync()
  }, [])

  return isLoadingComplete
}
