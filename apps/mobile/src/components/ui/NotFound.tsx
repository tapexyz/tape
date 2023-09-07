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
    text: {
      fontFamily: 'font-normal',
      fontSize: normalizeFont(13),
      color: themeConfig.textColor
    }
  })

const NotFound = () => {
  const { themeConfig } = useMobileTheme()
  const style = styles(themeConfig)
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        gap: 7,
        paddingVertical: 20
      }}
    >
      <ExpoImage
        source={{
          uri: imageCdn(`${STATIC_ASSETS}/mobile/icons/ice-cubes.png`, 'AVATAR')
        }}
        transition={300}
        contentFit="cover"
        style={{ width: 50, height: 50, borderRadius: 25 }}
      />
      <Text style={style.text}>Zero trace!</Text>
    </View>
  )
}

export default NotFound
