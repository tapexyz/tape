import { LinearGradient } from 'expo-linear-gradient'
import type { FC, PropsWithChildren } from 'react'
import React from 'react'
import { StyleSheet } from 'react-native'

import useMobileStore from '../../store'

const styles = StyleSheet.create({
  background: {
    flex: 1
  }
})

const hexCharacters = [
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  'A',
  'B',
  'C',
  'D',
  'E',
  'F'
]

const Container: FC<PropsWithChildren> = ({ children }) => {
  const setHomeGradientColor = useMobileStore(
    (state) => state.setHomeGradientColor
  )

  const generateJustOneColor = () => {
    let hexColorRep = '#'
    for (let index = 0; index < 6; index++) {
      const randomPosition = Math.floor(Math.random() * hexCharacters.length)
      hexColorRep += hexCharacters[randomPosition]
    }
    hexColorRep += '40'
    setHomeGradientColor(hexColorRep)
    return hexColorRep
  }

  return (
    <LinearGradient
      colors={[generateJustOneColor(), 'transparent']}
      start={{ x: 1, y: 0.2 }}
      style={styles.background}
    >
      {children}
    </LinearGradient>
  )
}

export default Container
