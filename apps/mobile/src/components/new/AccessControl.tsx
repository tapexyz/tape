import { REFERENCE_TEMPLATES } from '@lenstube/constants'
import type { MobileThemeConfig } from '@lenstube/lens/custom-types'
import React from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'

import normalizeFont from '~/helpers/normalize-font'
import { useMobileTheme } from '~/hooks'

const styles = (themeConfig: MobileThemeConfig) =>
  StyleSheet.create({
    container: {
      flex: 1,
      gap: 20,
      paddingVertical: 10
    },
    text: {
      fontFamily: 'font-medium',
      fontSize: normalizeFont(12),
      color: themeConfig.textColor,
      letterSpacing: 0.7
    },
    reference: {
      paddingHorizontal: 20,
      paddingVertical: 8,
      borderWidth: 0.5,
      borderRadius: 100,
      borderColor: themeConfig.borderColor
    },
    helperText: {
      fontFamily: 'font-medium',
      fontSize: normalizeFont(10),
      color: themeConfig.textColor,
      opacity: 0.8,
      letterSpacing: 1,
      paddingBottom: 10
    }
  })

const AccessControl = () => {
  const { themeConfig } = useMobileTheme()
  const style = styles(themeConfig)

  return (
    <View style={style.container}>
      <View>
        <Text style={style.helperText}>Who can view the post?</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 7 }}
        >
          <View style={style.reference}>
            <Text style={style.text}>My Followers</Text>
          </View>
          <View style={style.reference}>
            <Text style={style.text}>My Collectors</Text>
          </View>
        </ScrollView>
      </View>
      <View>
        <Text style={style.helperText}>Who can comment or mirror?</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 7 }}
        >
          {REFERENCE_TEMPLATES.map((r) => (
            <View key={r.id} style={style.reference}>
              <Text style={style.text}>{r.text}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  )
}

export default AccessControl
