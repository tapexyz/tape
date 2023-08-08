import { RECS_URL } from '@lenstube/constants'
import { getProfilePicture, shuffleArray } from '@lenstube/generic'
import type { Profile } from '@lenstube/lens'
import { useAllProfilesQuery } from '@lenstube/lens'
import { useNavigation } from '@react-navigation/native'
import { Image as ExpoImage } from 'expo-image'
import React, { useCallback } from 'react'
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native'
import Animated, { FadeInRight } from 'react-native-reanimated'
import useSWR from 'swr'

import normalizeFont from '~/helpers/normalize-font'
import { theme } from '~/helpers/theme'

import AnimatedPressable from '../ui/AnimatedPressable'

const BORDER_RADIUS = 25

const styles = StyleSheet.create({
  container: {
    marginTop: 10
  },
  imageContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    borderRadius: BORDER_RADIUS,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.grey
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
  const { navigate } = useNavigation()
  const shuffle = useCallback(
    (items: string[]) => shuffleArray(items ?? []),
    []
  )

  const { data: recsData, isLoading: recsLoading } = useSWR(
    `${RECS_URL}/k3l-score/creator/49/0`,
    (url: string) => fetch(url).then((res) => res.json()),
    { revalidateIfStale: true }
  )

  const { data, loading: profilesLoading } = useAllProfilesQuery({
    variables: {
      request: {
        handles: shuffle(recsData?.items)
      }
    },
    skip: recsLoading
  })
  const profiles = data?.profiles?.items as Profile[]
  const loading = recsLoading || profilesLoading

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trending on Lensverse</Text>
      <Text style={styles.subheading}>Discover, Connect, and Collect</Text>
      <Animated.View
        entering={FadeInRight.duration(500)}
        style={{
          paddingTop: 20
        }}
      >
        {loading && (
          <ActivityIndicator
            style={{
              height: 120,
              alignSelf: 'center',
              borderRadius: BORDER_RADIUS
            }}
          />
        )}
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 5 }}
        >
          {profiles?.map((profile) => (
            <AnimatedPressable
              key={profile.id}
              onPress={() =>
                navigate('ProfileModal', {
                  handle: profile.handle
                })
              }
              style={styles.imageContainer}
            >
              <ExpoImage
                source={{
                  uri: getProfilePicture(profile)
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
