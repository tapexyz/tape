import type { HeaderTitleProps } from '@react-navigation/elements'
import { Image as ExpoImage } from 'expo-image'
import type { FC } from 'react'
import React from 'react'
import { Text, View } from 'react-native'

const Header: FC<HeaderTitleProps> = () => {
  return (
    <View
      style={{
        display: 'flex',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row'
      }}
    >
      <Text>For you</Text>
      <ExpoImage
        source="https://picsum.photos/seed/696/3000/2000"
        contentFit="cover"
        style={{ width: 25, height: 25, borderRadius: 5 }}
      />
    </View>
  )
}

export default Header
