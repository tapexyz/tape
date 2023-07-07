import React, { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'

import normalizeFont from '~/helpers/normalize-font'
import { theme } from '~/helpers/theme'

const styles = StyleSheet.create({
  title: {
    color: theme.colors.white,
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
    backgroundColor: theme.colors.white
  }
})

const WaveForm = () => {
  const sticks = useMemo(() => Array(40).fill(1), [])

  const randomValue = (min = 1, max = 35) => {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  return (
    <View>
      <View style={styles.sticks}>
        {sticks.map((s, i) => (
          <View
            key={s + i}
            style={[
              styles.stick,
              {
                height: randomValue()
              }
            ]}
          />
        ))}
      </View>
      <View style={[styles.sticks, { opacity: 0.5, alignItems: 'flex-start' }]}>
        {sticks.map((s, i) => (
          <View
            key={s + i}
            style={[
              styles.stick,
              {
                height: randomValue(5, 20)
              }
            ]}
          />
        ))}
      </View>
    </View>
  )
}

export default WaveForm
