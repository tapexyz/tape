import { STATIC_ASSETS } from '@lenstube/constants'
import { imageCdn } from '@lenstube/generic'
import type { MobileThemeConfig } from '@lenstube/lens/custom-types'
import { Image as ExpoImage } from 'expo-image'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

import normalizeFont from '~/helpers/normalize-font'
import { useMobileTheme } from '~/hooks'

const BORDER_RADIUS = 25

const styles = (themeConfig: MobileThemeConfig) =>
  StyleSheet.create({
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
      color: themeConfig.textColor,
      fontSize: normalizeFont(24)
    }
  })

const IntroCard = () => {
  const { themeConfig } = useMobileTheme()
  const style = styles(themeConfig)

  return (
    <View style={style.card}>
      <ExpoImage
        source={{
          uri: imageCdn(`${STATIC_ASSETS}/mobile/images/listening.png`)
        }}
        transition={300}
        style={style.image}
      />
      <View style={style.whTextWrapper}>
        <Text style={style.whText}>Turn Up {'\n'}the Vibe</Text>
      </View>
    </View>
  )
}

export default IntroCard
