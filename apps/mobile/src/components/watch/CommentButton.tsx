import { STATIC_ASSETS } from '@lenstube/constants'
import { imageCdn } from '@lenstube/generic'
import { Image as ExpoImage } from 'expo-image'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

import normalizeFont from '~/helpers/normalize-font'
import { theme } from '~/helpers/theme'

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20
  },
  text: {
    fontFamily: 'font-medium',
    fontSize: normalizeFont(12),
    color: theme.colors.white
  },
  icon: {
    width: 35,
    height: 35
  }
})

const CommentButton = () => {
  return (
    <View style={styles.container}>
      <ExpoImage
        source={{
          uri: imageCdn(`${STATIC_ASSETS}/mobile/icons/speech-bubble.png`)
        }}
        style={styles.icon}
      />
      <Text style={styles.text}>Got something to say? Comment it up!</Text>
    </View>
  )
}

export default CommentButton
