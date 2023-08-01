import { VERIFIED_CHANNELS } from '@lenstube/constants'
import { getProfilePicture, shuffleArray } from '@lenstube/generic'
import type { Profile } from '@lenstube/lens'
import { useAllProfilesQuery } from '@lenstube/lens'
import { Image as ExpoImage } from 'expo-image'
import React, { useMemo } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import Animated, { FadeInRight } from 'react-native-reanimated'

import haptic from '~/helpers/haptic'
import normalizeFont from '~/helpers/normalize-font'
import { theme } from '~/helpers/theme'

import AnimatedPressable from '../ui/AnimatedPressable'

const BORDER_RADIUS = 25

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginHorizontal: 5
  },
  imageContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    borderRadius: BORDER_RADIUS,
    overflow: 'hidden',
    marginRight: 6
  },
  title: {
    fontFamily: 'font-bold',
    color: theme.colors.white,
    fontSize: normalizeFont(14)
  },
  subheading: {
    fontFamily: 'font-normal',
    color: theme.colors.secondary,
    fontSize: normalizeFont(12)
  },
  image: {
    width: 120,
    height: 120,
    backgroundColor: theme.colors.backdrop
  }
})

const PopularCreators = () => {
  const profileIds = useMemo(
    () => shuffleArray(VERIFIED_CHANNELS).slice(0, 15),
    []
  )
  const { data } = useAllProfilesQuery({
    variables: {
      request: { profileIds }
    }
  })
  const profiles = data?.profiles?.items as Profile[]

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Creators on Lensverse</Text>
      <Text style={styles.subheading}>Discover, Connect, and Collect</Text>
      <Animated.View entering={FadeInRight.duration(500)}>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{
            paddingTop: 20
          }}
        >
          {profiles?.map((p) => (
            <AnimatedPressable
              key={p.id}
              onPress={() => haptic()}
              style={styles.imageContainer}
            >
              <ExpoImage
                source={{
                  uri: getProfilePicture(p)
                }}
                transition={300}
                style={styles.image}
              />
            </AnimatedPressable>
          ))}
        </ScrollView>
      </Animated.View>
    </View>
  )
}

export default PopularCreators
