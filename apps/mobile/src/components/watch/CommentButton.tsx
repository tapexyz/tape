import { STATIC_ASSETS } from '@lenstube/constants'
import { imageCdn } from '@lenstube/generic'
import type { MobileThemeConfig } from '@lenstube/lens/custom-types'
import { Image as ExpoImage } from 'expo-image'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

import normalizeFont from '~/helpers/normalize-font'
import { useMobileTheme } from '~/hooks'

const styles = (themeConfig: MobileThemeConfig) =>
  StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10
    },
    text: {
      fontFamily: 'font-medium',
      fontSize: normalizeFont(12),
      color: themeConfig.textColor
    },
    icon: {
      width: 35,
      height: 35
    }
  })

const CommentButton = () => {
  const { themeConfig } = useMobileTheme()
  const style = styles(themeConfig)

  return (
    <View style={style.container}>
      <ExpoImage
        source={{
          uri: imageCdn(`${STATIC_ASSETS}/mobile/icons/speech-bubble.png`)
        }}
        transition={300}
        style={style.icon}
      />
      <Text style={style.text}>Got something to say? Comment it up!</Text>
    </View>
  )
}

export default CommentButton
