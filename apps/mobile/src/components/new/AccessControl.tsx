import { REFERENCE_TEMPLATES } from '@lenstube/constants'
import React from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'

import normalizeFont from '~/helpers/normalize-font'
import { theme } from '~/helpers/theme'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
    paddingVertical: 10
  },
  text: {
    fontFamily: 'font-medium',
    fontSize: normalizeFont(12),
    color: theme.colors.white,
    letterSpacing: 0.7
  },
  reference: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderRadius: 100,
    borderColor: theme.colors.grey
  },
  helperText: {
    fontFamily: 'font-medium',
    fontSize: normalizeFont(10),
    color: theme.colors.white,
    opacity: 0.8,
    letterSpacing: 1,
    paddingBottom: 10
  }
})

const AccessControl = () => {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.helperText}>Who can view the post?</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 7 }}
        >
          <View style={styles.reference}>
            <Text style={styles.text}>My Followers</Text>
          </View>
          <View style={styles.reference}>
            <Text style={styles.text}>My Collectors</Text>
          </View>
        </ScrollView>
      </View>
      <View>
        <Text style={styles.helperText}>Who can comment or mirror?</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 7 }}
        >
          {REFERENCE_TEMPLATES.map((r) => (
            <View key={r.id} style={styles.reference}>
              <Text style={styles.text}>{r.text}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  )
}

export default AccessControl
