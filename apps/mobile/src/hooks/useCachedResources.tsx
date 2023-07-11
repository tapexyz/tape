import { Ionicons } from '@expo/vector-icons'
import * as Font from 'expo-font'
import { useEffect, useState } from 'react'

export const useCachedResources = (): boolean => {
  const [isLoadingComplete, setLoadingComplete] = useState(false)

  const loadResourcesAndDataAsync = async () => {
    try {
      await Font.loadAsync({
        ...Ionicons.font,
        'font-normal': require('assets/fonts/ClashDisplay-Regular.ttf'),
        'font-medium': require('assets/fonts/ClashDisplay-Medium.ttf'),
        'font-bold': require('assets/fonts/ClashDisplay-Semibold.ttf'),
        'font-extrabold': require('assets/fonts/ClashDisplay-Bold.ttf')
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
