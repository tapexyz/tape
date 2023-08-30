import { RECS_URL } from '@lenstube/constants'
import { getProfilePicture, shuffleArray } from '@lenstube/generic'
import type { Profile } from '@lenstube/lens'
import { useAllProfilesQuery } from '@lenstube/lens'
import type { MobileThemeConfig } from '@lenstube/lens/custom-types'
import { useNavigation } from '@react-navigation/native'
import { Image as ExpoImage } from 'expo-image'
import React, { useMemo } from 'react'
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
import { useMobileTheme } from '~/hooks'

import AnimatedPressable from '../ui/AnimatedPressable'

const BORDER_RADIUS = 25

const styles = (themeConfig: MobileThemeConfig) =>
  StyleSheet.create({
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
      borderColor: themeConfig.borderColor
    },
    title: {
      fontFamily: 'font-bold',
      color: themeConfig.textColor,
      fontSize: normalizeFont(14)
    },
    subheading: {
      fontFamily: 'font-normal',
      color: themeConfig.secondaryTextColor,
      fontSize: normalizeFont(12)
    },
    image: {
      width: 120,
      height: 120,
      backgroundColor: themeConfig.backgroudColor2
    }
  })

const PopularCreators = () => {
  const { navigate } = useNavigation()
  const { themeConfig } = useMobileTheme()
  const style = styles(themeConfig)

  const { data: recsData, isLoading: recsLoading } = useSWR(
    `${RECS_URL}/k3l-score/creator/49/0`,
    (url: string) => fetch(url).then((res) => res.json())
  )

  const { data, loading: profilesLoading } = useAllProfilesQuery({
    variables: {
      request: {
        handles: recsData?.items
      }
    },
    skip: recsLoading
  })
  const profiles = data?.profiles?.items as Profile[]
  const loading = recsLoading || profilesLoading

  const shuffled = useMemo(
    () => shuffleArray(profiles ? [...profiles] : []),
    [profiles]
  )

  return (
    <View style={style.container}>
      <Text style={style.title}>Creators on Lens</Text>
      <Text style={style.subheading}>Discover, Connect, and Collect</Text>
      <Animated.View
        entering={FadeInRight}
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
          {shuffled?.map((profile) => (
            <AnimatedPressable
              key={profile.id}
              onPress={() =>
                navigate('ProfileScreen', {
                  handle: profile.handle
                })
              }
              style={style.imageContainer}
            >
              <ExpoImage
                source={{
                  uri: getProfilePicture(profile)
                }}
                transition={300}
                style={style.image}
              />
            </AnimatedPressable>
          ))}
        </ScrollView>
      </Animated.View>
    </View>
  )
}

export default PopularCreators
