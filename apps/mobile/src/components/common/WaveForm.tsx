import type { MobileThemeConfig } from '@lenstube/lens/custom-types'
import React, { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'

import normalizeFont from '~/helpers/normalize-font'
import { useMobileTheme } from '~/hooks'

const styles = (themeConfig: MobileThemeConfig) =>
  StyleSheet.create({
    title: {
      color: themeConfig.textColor,
      fontFamily: 'font-bold',
      fontSize: normalizeFont(13),
      letterSpacing: 0.5
    },
    sticks: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-end',
      gap: 5
    },
    stick: {
      width: 1,
      borderRadius: 10,
      backgroundColor: '#FF9729'
    }
  })

const WaveForm = () => {
  const { themeConfig } = useMobileTheme()
  const style = styles(themeConfig)
  const sticks = useMemo(() => Array(100).fill(1), [])

  const getRandomInt = (min = 0, max = 30) => {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  return (
    <View>
      <View style={style.sticks}>
        {sticks.map((s, i) => (
          <View
            key={s + i}
            style={[
              style.stick,
              {
                height: getRandomInt()
              }
            ]}
          />
        ))}
      </View>
      <View style={[style.sticks, { alignItems: 'flex-start' }]}>
        {sticks.map((s, i) => (
          <View
            key={s + i}
            style={[
              style.stick,
              {
                height: getRandomInt(5, 12),
                backgroundColor: '#606060'
              }
            ]}
          />
        ))}
      </View>
    </View>
  )
}

export default WaveForm
