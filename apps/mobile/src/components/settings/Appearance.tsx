import Ionicons from '@expo/vector-icons/Ionicons'
import type { MobileThemeConfig } from '@lenstube/lens/custom-types'
import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import normalizeFont from '~/helpers/normalize-font'
import { colors } from '~/helpers/theme'
import { useMobileTheme } from '~/hooks'
import { useMobilePersistStore } from '~/store/persist'

import Accordion from '../ui/Accordion'
import AnimatedPressable from '../ui/AnimatedPressable'

const BOX_HEIGHT = 50

const styles = (themeConfig: MobileThemeConfig) =>
  StyleSheet.create({
    content: {
      flex: 1,
      padding: 10,
      flexDirection: 'row',
      justifyContent: 'space-evenly'
    },
    text: {
      fontFamily: 'font-medium',
      fontSize: normalizeFont(12),
      color: themeConfig.textColor
    },
    themeBox: {
      width: BOX_HEIGHT,
      height: BOX_HEIGHT,
      borderRadius: 10,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      borderColor: themeConfig.borderColor,
      borderWidth: 1
    },
    button: {
      alignItems: 'center',
      gap: 5
    }
  })

const Content = () => {
  const { themeConfig } = useMobileTheme()
  const style = styles(themeConfig)
  const theme = useMobilePersistStore((state) => state.theme)
  const setTheme = useMobilePersistStore((state) => state.setTheme)

  return (
    <View style={style.content}>
      <AnimatedPressable style={style.button} onPress={() => setTheme('light')}>
        <View style={[style.themeBox, { backgroundColor: colors.white }]}>
          {theme === 'light' && (
            <Ionicons
              name="checkmark-outline"
              color={themeConfig.textColor}
              size={22}
            />
          )}
        </View>
        <Text style={style.text}>Light</Text>
      </AnimatedPressable>
      <AnimatedPressable style={style.button} onPress={() => setTheme('dark')}>
        <View style={[style.themeBox, { backgroundColor: colors.black }]}>
          {theme === 'dark' && (
            <Ionicons
              name="checkmark-outline"
              color={themeConfig.textColor}
              size={22}
            />
          )}
        </View>
        <Text style={style.text}>Dark</Text>
      </AnimatedPressable>
      <AnimatedPressable
        style={style.button}
        onPress={() => setTheme('garden')}
      >
        <View style={[style.themeBox, { backgroundColor: colors.garden }]}>
          {theme === 'garden' && (
            <Ionicons
              name="checkmark-outline"
              color={themeConfig.contrastTextColor}
              size={22}
            />
          )}
        </View>
        <Text style={style.text}>Garden</Text>
      </AnimatedPressable>
    </View>
  )
}

const Appearance = () => {
  const [active, setActive] = useState(false)

  return (
    <Accordion
      active={active}
      text="Appearance"
      setActive={setActive}
      content={<Content />}
    />
  )
}

export default Appearance
