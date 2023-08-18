import { STATIC_ASSETS } from '@lenstube/constants'
import { imageCdn } from '@lenstube/generic'
import { Image as ExpoImage } from 'expo-image'
import React from 'react'
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native'
import { notify } from 'react-native-notificated'

import haptic from '~/helpers/haptic'
import normalizeFont from '~/helpers/normalize-font'
import { theme } from '~/helpers/theme'
import useMobileStore from '~/store'

const styles = StyleSheet.create({
  container: {
    marginVertical: 30
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
  const selectedChannel = useMobileStore((state) => state.selectedChannel)

  return (
    <ScrollView
      style={styles.container}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 5 }}
    >
      <Pressable
        onPress={() => haptic()}
        style={[styles.filter, { backgroundColor: theme.colors.white }]}
      >
        <ExpoImage
          source={{
            uri: imageCdn(`${STATIC_ASSETS}/mobile/icons/in-love.png`, 'AVATAR')
          }}
          style={styles.image}
        />
        <Text style={[styles.text, { color: theme.colors.black }]}>
          For You
        </Text>
      </Pressable>
      <Pressable
        onPress={() => {
          if (!selectedChannel) {
            return notify('info', { params: { title: 'Sign in with Lens' } })
          }
        }}
        style={styles.filter}
      >
        <ExpoImage
          source={{
            uri: imageCdn(`${STATIC_ASSETS}/mobile/icons/smile.png`, 'AVATAR')
          }}
          style={styles.image}
        />
        <Text style={[styles.text, { color: theme.colors.white }]}>
          Following
        </Text>
      </Pressable>
      <Pressable
        onPress={() => {
          if (!selectedChannel) {
            return notify('info', { params: { title: 'Sign in with Lens' } })
          }
        }}
        style={styles.filter}
      >
        <ExpoImage
          source={{
            uri: imageCdn(`${STATIC_ASSETS}/mobile/icons/wow.png`, 'AVATAR')
          }}
          style={styles.image}
        />
        <Text style={[styles.text, { color: theme.colors.white }]}>
          Highlights
        </Text>
      </Pressable>
      <Pressable
        onPress={() => {
          if (!selectedChannel) {
            return notify('info', { params: { title: 'Sign in with Lens' } })
          }
        }}
        style={styles.filter}
      >
        <ExpoImage
          source={{
            uri: imageCdn(`${STATIC_ASSETS}/mobile/icons/proud.png`, 'AVATAR')
          }}
          style={styles.image}
        />
        <Text style={[styles.text, { color: theme.colors.white }]}>
          Feed Flex
        </Text>
      </Pressable>
    </ScrollView>
  )
}

export default TimelineFilters
