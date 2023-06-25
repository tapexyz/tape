import { Image as ExpoImage } from 'expo-image'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

import normalizeFont from '~/helpers/normalize-font'
import { theme } from '~/helpers/theme'

const BORDER_RADIUS = 25

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: BORDER_RADIUS,
    backgroundColor: '#CBF3F0',
    display: 'flex',
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 20
  },
  image: {
    width: 100,
    height: 100,
    contentFit: 'cover'
  },
  whTextWrapper: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  whText: {
    fontFamily: 'font-bold',
    color: theme.colors.black,
    fontSize: normalizeFont(24)
  }
})

const IntroCard = () => {
  return (
    <View style={styles.card}>
      <ExpoImage
        source={require('assets/images/listening.png')}
        style={styles.image}
      />
      <View style={styles.whTextWrapper}>
        <Text style={styles.whText}>Turn Up {'\n'}the Vibe</Text>
      </View>
    </View>
  )
}

export default IntroCard
