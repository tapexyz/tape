import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import haptic from '~/helpers/haptic'
import normalizeFont from '~/helpers/normalize-font'
import { theme } from '~/helpers/theme'

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    display: 'flex',
    flex: 1,
    flexDirection: 'row'
  },
  filter: {
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: 25
  },
  text: {
    fontFamily: 'font-bold',
    fontSize: normalizeFont(12),
    letterSpacing: 0.5
  },
  image: {
    width: 20,
    height: 20
  }
})

const MusicFilters = () => {
  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => haptic()}
        style={[styles.filter, { backgroundColor: theme.colors.white }]}
      >
        <Text style={[styles.text, { color: theme.colors.black }]}>
          Listen to Music
        </Text>
      </Pressable>
      <Pressable onPress={() => haptic()} style={styles.filter}>
        <Text style={[styles.text, { color: theme.colors.white }]}>
          Watch Video
        </Text>
      </Pressable>
    </View>
  )
}

export default MusicFilters
