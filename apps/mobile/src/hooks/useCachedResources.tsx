import { Ionicons } from '@expo/vector-icons'
import * as Font from 'expo-font'
import { useEffect, useState } from 'react'

export const useCachedResources = (): boolean => {
  const [isLoadingComplete, setLoadingComplete] = useState(false)

  const loadResourcesAndDataAsync = async () => {
    try {
      await Font.loadAsync({
        ...Ionicons.font,
        'font-light': require('assets/fonts/SpaceGrotesk-Light.ttf'),
        'font-normal': require('assets/fonts/SpaceGrotesk-Regular.ttf'),
        'font-medium': require('assets/fonts/SpaceGrotesk-Medium.ttf'),
        'font-semibold': require('assets/fonts/SpaceGrotesk-SemiBold.ttf'),
        'font-bold': require('assets/fonts/SpaceGrotesk-Bold.ttf')
      })
    } catch (e) {
      console.warn(e)
    }
  }

  useEffect(() => {
    loadResourcesAndDataAsync().finally(() => {
      setLoadingComplete(true)
    })
  }, [])

  return isLoadingComplete
}
