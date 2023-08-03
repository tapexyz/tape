import { STATIC_ASSETS } from '@lenstube/constants'
import { imageCdn } from '@lenstube/generic'
import { Image as ExpoImage } from 'expo-image'
import React from 'react'
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native'

import haptic from '~/helpers/haptic'
import normalizeFont from '~/helpers/normalize-font'
import { theme } from '~/helpers/theme'

const styles = StyleSheet.create({
  container: {
    marginVertical: 30,
    marginHorizontal: 5
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

const FeedFilters = () => {
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
          source={{
            uri: imageCdn(`${STATIC_ASSETS}/mobile/icons/in-love.png`, 'AVATAR')
          }}
          transition={300}
          style={styles.image}
        />
        <Text style={[styles.text, { color: theme.colors.black }]}>Feed</Text>
      </Pressable>
      <Pressable onPress={() => haptic()} style={styles.filter}>
        <ExpoImage
          source={{
            uri: imageCdn(`${STATIC_ASSETS}/mobile/icons/smile.png`, 'AVATAR')
          }}
          transition={300}
          style={styles.image}
        />
        <Text style={[styles.text, { color: theme.colors.white }]}>Bytes</Text>
      </Pressable>
      <Pressable onPress={() => haptic()} style={styles.filter}>
        <ExpoImage
          source={{
            uri: imageCdn(`${STATIC_ASSETS}/mobile/icons/proud.png`, 'AVATAR')
          }}
          transition={300}
          style={styles.image}
        />
        <Text style={[styles.text, { color: theme.colors.white }]}>
          Comments
        </Text>
      </Pressable>
      <Pressable onPress={() => haptic()} style={styles.filter}>
        <ExpoImage
          source={{
            uri: imageCdn(`${STATIC_ASSETS}/mobile/icons/smile.png`, 'AVATAR')
          }}
          transition={300}
          style={styles.image}
        />
        <Text style={[styles.text, { color: theme.colors.white }]}>
          Gallery
        </Text>
      </Pressable>
    </ScrollView>
  )
}

export default FeedFilters
