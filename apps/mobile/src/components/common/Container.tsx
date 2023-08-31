import { ALLOWED_HEX_CHARACTERS } from '@lenstube/constants'
import { useHeaderHeight } from '@react-navigation/elements'
import { LinearGradient } from 'expo-linear-gradient'
import type { FC, PropsWithChildren } from 'react'
import React from 'react'
import { StyleSheet } from 'react-native'

import { colors } from '~/helpers/theme'
import useMobileStore from '~/store'

const styles = StyleSheet.create({
  background: {
    flex: 1
  }
})

const Container: FC<PropsWithChildren> = ({ children }) => {
  const headerHeight = useHeaderHeight()

  const homeGradientColor = useMobileStore((state) => state.homeGradientColor)

  const setHomeGradientColor = useMobileStore(
    (state) => state.setHomeGradientColor
  )

  const generateJustOneColor = () => {
    if (homeGradientColor !== colors.black) {
      return `${homeGradientColor}35`
    }
    let hexColorRep = '#'
    for (let index = 0; index < 6; index++) {
      const randomPosition = Math.floor(
        Math.random() * ALLOWED_HEX_CHARACTERS.length
      )
      hexColorRep += ALLOWED_HEX_CHARACTERS[randomPosition]
    }
    setHomeGradientColor(hexColorRep)
    return (hexColorRep += '35')
  }

  return (
    <LinearGradient
      colors={[generateJustOneColor(), 'transparent']}
      style={[styles.background, { paddingTop: headerHeight }]}
      locations={[0, 0.9]}
    >
      {children}
    </LinearGradient>
  )
}

export default Container
