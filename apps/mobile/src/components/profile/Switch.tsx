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
import { Image as ExpoImage, ImageBackground } from 'expo-image'
import React, { useCallback } from 'react'
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native'
import Animated, { FadeInRight } from 'react-native-reanimated'

import haptic from '~/helpers/haptic'
import normalizeFont from '~/helpers/normalize-font'
import { theme } from '~/helpers/theme'
import useMobileStore from '~/store'

import AnimatedPressable from '../ui/AnimatedPressable'

const BORDER_RADIUS = 15

const styles = StyleSheet.create({
  card: {
    gap: 8,
    padding: 10,
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
  }
})

const Switch = () => {
  const selectedChannel = useMobileStore((state) => state.selectedChannel)
  const setSelectedChannel = useMobileStore((state) => state.setSelectedChannel)

  const renderItem = useCallback(
    ({ profile }: { profile: Profile }) => (
      <View
        key={profile.id}
        style={{
          margin: 5,
          backgroundColor: theme.colors.black,
          borderRadius: BORDER_RADIUS,
          display: 'flex'
        }}
      >
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
          blurRadius={20}
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
              style={{ width: 30, height: 30, borderRadius: 8 }}
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

  const { data, loading } = useAllProfilesQuery({
    variables: {
      request: { ownedBy: [selectedChannel?.ownedBy] }
    }
  })
  const profiles = data?.profiles?.items as Profile[]

  if (loading || !profiles?.length) {
    return <ActivityIndicator style={{ flex: 1 }} />
  }

  return (
    <Animated.View entering={FadeInRight.delay(200)}>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        {profiles?.map((profile) => renderItem({ profile }))}
      </ScrollView>
    </Animated.View>
  )
}

export default Switch
