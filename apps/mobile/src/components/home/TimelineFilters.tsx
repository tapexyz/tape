import { Image as ExpoImage } from 'expo-image'
import React from 'react'
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native'

import haptic from '~/helpers/haptic'
import normalizeFont from '~/helpers/normalize-font'
import { theme } from '~/helpers/theme'

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    marginHorizontal: 10
  },
  filter: {
    paddingHorizontal: 15,
    paddingVertical: 7,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 25
  },
  text: {
    fontFamily: 'font-bold',
    fontSize: normalizeFont(12)
  },
  image: {
    width: 20,
    height: 20
  }
})

const TimelineFilters = () => {
  return (
    <ScrollView
      style={styles.container}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
    >
      <Pressable
        onPress={() => haptic()}
        style={[styles.filter, { backgroundColor: theme.colors.white }]}
      >
        <ExpoImage
          source={require('assets/icons/in-love.png')}
          style={styles.image}
        />
        <Text style={[styles.text, { color: theme.colors.black }]}>
          Everyone's Watching
        </Text>
      </Pressable>
      <Pressable onPress={() => haptic()} style={styles.filter}>
        <ExpoImage
          source={require('assets/icons/smile.png')}
          style={styles.image}
        />
        <Text style={[styles.text, { color: theme.colors.white }]}>
          For You
        </Text>
      </Pressable>
      <Pressable onPress={() => haptic()} style={styles.filter}>
        <ExpoImage
          source={require('assets/icons/proud.png')}
          style={styles.image}
        />
        <Text style={[styles.text, { color: theme.colors.white }]}>
          Highlights
        </Text>
      </Pressable>
    </ScrollView>
  )
}

export default TimelineFilters
