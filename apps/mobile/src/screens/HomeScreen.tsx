import { Image as ExpoImage } from 'expo-image'
import React, { useCallback } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

export const HomeScreen = (props: HomeScreenProps): JSX.Element => {
  const {
    navigation: { navigate }
  } = props

  const navigateToDetails = useCallback(() => {
    navigate('Details', { id: 'home-id' })
  }, [navigate])

  return (
    <View style={{ flex: 1 }}>
      <ExpoImage
        source="https://picsum.photos/seed/696/3000/2000"
        contentFit="contain"
      />
      <Text>{'hello'}</Text>
      <Text>{'thanks'}</Text>
      <Text>{'app_information'}</Text>
      <TouchableOpacity onPress={navigateToDetails}>
        <Text>{'home_screen.details'}</Text>
      </TouchableOpacity>
    </View>
  )
}
