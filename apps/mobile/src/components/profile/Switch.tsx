import {
  formatNumber,
  getChannelCoverPicture,
  getProfilePicture,
  imageCdn,
  sanitizeDStorageUrl,
  trimLensHandle
} from '@lenstube/generic'
import type { Profile } from '@lenstube/lens'
import { useAllProfilesQuery } from '@lenstube/lens'
import { Image as ExpoImage } from 'expo-image'
import { Skeleton } from 'moti/skeleton'
import React, { useCallback } from 'react'
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'

import haptic from '~/helpers/haptic'
import normalizeFont from '~/helpers/normalize-font'
import { theme } from '~/helpers/theme'
import useMobileStore from '~/store'

import AnimatedPressable from '../ui/AnimatedPressable'

const BORDER_RADIUS = 100

const styles = StyleSheet.create({
  cardContainer: {
    display: 'flex',
    margin: 5,
    backgroundColor: theme.colors.black,
    borderRadius: BORDER_RADIUS
  },
  card: {
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS
  },
  otherInfo: {
    fontFamily: 'font-medium',
    fontSize: normalizeFont(10),
    color: theme.colors.white,
    opacity: 0.6
  },
  handle: {
    fontFamily: 'font-normal',
    fontSize: normalizeFont(12),
    color: theme.colors.white
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: BORDER_RADIUS,
    borderWidth: 0.5,
    borderColor: theme.colors.grey
  }
})

const Switch = () => {
  const selectedChannel = useMobileStore((state) => state.selectedChannel)
  const setSelectedChannel = useMobileStore((state) => state.setSelectedChannel)

  const renderItem = useCallback(
    ({ profile }: { profile: Profile }) => (
      <View key={profile.id} style={styles.cardContainer}>
        <ImageBackground
          source={{
            uri: imageCdn(
              sanitizeDStorageUrl(getChannelCoverPicture(profile)),
              'THUMBNAIL'
            )
          }}
          style={{
            borderWidth: 2,
            borderColor:
              selectedChannel?.id === profile.id
                ? theme.colors.white
                : theme.colors.black,
            borderRadius: BORDER_RADIUS
          }}
          imageStyle={{
            opacity: 0.3,
            borderRadius: BORDER_RADIUS
          }}
        >
          <AnimatedPressable
            key={profile.id}
            style={styles.card}
            onPress={() => {
              setSelectedChannel(profile)
              haptic()
            }}
          >
            <ExpoImage
              source={{
                uri: getProfilePicture(profile)
              }}
              contentFit="cover"
              transition={500}
              style={styles.profileImage}
            />
            <View>
              <Text numberOfLines={1} style={styles.handle}>
                {trimLensHandle(profile.handle)}
              </Text>
              <Text style={styles.otherInfo}>
                {formatNumber(profile.stats.totalFollowers)} followers
              </Text>
            </View>
          </AnimatedPressable>
        </ImageBackground>
      </View>
    ),
    [selectedChannel, setSelectedChannel]
  )

  const { data, loading, error } = useAllProfilesQuery({
    variables: {
      request: { ownedBy: [selectedChannel?.ownedBy] }
    }
  })
  const profiles = data?.profiles?.items as Profile[]

  if (error || !selectedChannel) {
    return null
  }

  return (
    <Skeleton
      show={loading}
      colors={[theme.colors.backdrop2, theme.colors.backdrop]}
      radius={BORDER_RADIUS}
    >
      <Animated.View entering={FadeIn.delay(200)}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {profiles
            ? profiles?.map((profile) => renderItem({ profile }))
            : renderItem({ profile: selectedChannel })}
        </ScrollView>
      </Animated.View>
    </Skeleton>
  )
}

export default Switch
