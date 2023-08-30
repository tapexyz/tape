import { COLLECT_TEMPLATES } from '@lenstube/constants'
import type { MobileThemeConfig } from '@lenstube/lens/custom-types'
import React from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'

import normalizeFont from '~/helpers/normalize-font'
import { useMobileTheme } from '~/hooks'

const styles = (themeConfig: MobileThemeConfig) =>
  StyleSheet.create({
    container: {
      flex: 1,
      gap: 10
    },
    text: {
      fontFamily: 'font-medium',
      fontSize: normalizeFont(12),
      color: themeConfig.textColor,
      letterSpacing: 0.7
    },
    template: {
      paddingHorizontal: 20,
      paddingVertical: 8,
      borderWidth: 0.5,
      borderRadius: 100,
      borderColor: themeConfig.borderColor
    }
  })

const CollectTemplates = () => {
  const { themeConfig } = useMobileTheme()
  const style = styles(themeConfig)

  return (
    <View style={style.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 7 }}
      >
        {COLLECT_TEMPLATES.FOLLOWERS.map((t) => (
          <View key={t.id} style={style.template}>
            <Text style={style.text}>{t.text}</Text>
          </View>
        ))}
      </ScrollView>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 7 }}
      >
        {COLLECT_TEMPLATES.ANYONE.map((t) => (
          <View key={t.id} style={style.template}>
            <Text style={style.text}>{t.text}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

export default CollectTemplates
