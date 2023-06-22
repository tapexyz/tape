import type { HeaderTitleProps } from '@react-navigation/elements'
import { Image as ExpoImage } from 'expo-image'
import type { FC } from 'react'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { theme } from '../../constants/theme'
import normalizeFont from '../../helpers/normalize-font'
import { useAuth } from '../../hooks/useAuth'

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  forYouText: {
    color: theme.colors.primary,
    fontFamily: 'font-bold',
    fontWeight: '500',
    fontSize: normalizeFont(18)
  }
})

const Header: FC<HeaderTitleProps> = () => {
  const isSignedIn = useAuth((state) => state.isSignedIn)
  return (
    <View style={styles.container}>
      <Text style={styles.forYouText}>{isSignedIn ? 'For Sasi' : 'gm'}</Text>
      <ExpoImage
        source={require('assets/icons/herb.png')}
        contentFit="cover"
        style={{ width: 20, height: 20, borderRadius: 8 }}
      />
    </View>
  )
}

export default Header
