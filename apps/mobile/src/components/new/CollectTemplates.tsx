import { COLLECT_TEMPLATES } from '@lenstube/constants'
import React from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'

import normalizeFont from '~/helpers/normalize-font'
import { theme } from '~/helpers/theme'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 5,
    gap: 10
  },
  text: {
    fontFamily: 'font-medium',
    fontSize: normalizeFont(10),
    color: theme.colors.white
  },
  template: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderWidth: 0.5,
    borderRadius: 100,
    borderColor: theme.colors.grey
  }
})

const CollectTemplates = () => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 5 }}
      >
        {COLLECT_TEMPLATES.FOLLOWERS.map((t) => (
          <View key={t.id} style={styles.template}>
            <Text style={styles.text}>{t.text}</Text>
          </View>
        ))}
      </ScrollView>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 5 }}
      >
        {COLLECT_TEMPLATES.ANYONE.map((t) => (
          <View key={t.id} style={styles.template}>
            <Text style={styles.text}>{t.text}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

export default CollectTemplates
