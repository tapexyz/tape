import Ionicons from '@expo/vector-icons/Ionicons'
import {
  getChannelCoverPicture,
  imageCdn,
  sanitizeDStorageUrl,
  trimLensHandle,
  trimNewLines
} from '@lenstube/generic'
import type { Profile } from '@lenstube/lens'
import { useNavigation } from '@react-navigation/native'
import type { FC } from 'react'
import React, { memo, useState } from 'react'
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View
} from 'react-native'
import type { SharedValue } from 'react-native-reanimated'
import Animated, {
  Extrapolate,
  FadeInRight,
  interpolate,
  useAnimatedStyle
} from 'react-native-reanimated'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { SharedElement } from 'react-navigation-shared-element'

import normalizeFont from '~/helpers/normalize-font'
import { theme, windowWidth } from '~/helpers/theme'
import useMobileStore from '~/store'

import UserProfile from '../common/UserProfile'
import Ticker from '../ui/Ticker'
import OnChainIdentities from './OnChainIdentities'

type Props = {
  profile: Profile
  contentScrollY: SharedValue<number>
}

const styles = StyleSheet.create({
  icon: {
    backgroundColor: theme.colors.backdrop,
    borderRadius: 100,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 35,
    height: 35
  },
  text: {
    fontFamily: 'font-medium',
    fontSize: normalizeFont(10),
    color: theme.colors.white,
    opacity: 0.8
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: 20
  },
  stat: {
    flexDirection: 'column',
    width: windowWidth * 0.3,
    alignItems: 'center',
    gap: 4
  },
  tickerText: {
    fontFamily: 'font-bold',
    color: theme.colors.white
  },
  handle: {
    fontFamily: 'font-bold',
    color: theme.colors.white,
    fontSize: normalizeFont(35),
    letterSpacing: 0.6
  },
  bio: {
    fontFamily: 'font-medium',
    fontSize: normalizeFont(12),
    color: theme.colors.white,
    opacity: 0.6
  }
})

const Info: FC<Props> = ({ profile, contentScrollY }) => {
  const { goBack } = useNavigation()
  const { height } = useWindowDimensions()
  const insets = useSafeAreaInsets()

  const selectedChannel = useMobileStore((state) => state.selectedChannel)
  const isOwned = selectedChannel?.id === profile.id

  const [showMoreBio, setShowMoreBio] = useState(false)
  const [headerHeight, setHeaderHeight] = useState(0)

  const animatedHeaderStyle = useAnimatedStyle(() => {
    return {
      height:
        headerHeight !== 0
          ? interpolate(
              contentScrollY.value,
              [0, headerHeight],
              [headerHeight, insets.top],
              Extrapolate.CLAMP
            )
          : undefined,
      opacity: interpolate(
        contentScrollY.value,
        [0, headerHeight / 2], // the value /3 is added to speed up the opacity timing
        [1, 0],
        Extrapolate.CLAMP
      )
    }
  })

  return (
    <Animated.View style={animatedHeaderStyle}>
      <Animated.View
        onLayout={(event) => {
          const { height } = event.nativeEvent.layout
          if (headerHeight !== height) {
            setHeaderHeight(height)
          }
        }}
      >
        <ImageBackground
          source={{
            uri: imageCdn(
              sanitizeDStorageUrl(getChannelCoverPicture(profile)),
              'THUMBNAIL'
            )
          }}
          blurRadius={5}
          resizeMode="cover"
          style={{
            height: height * 0.14,
            paddingHorizontal: 10
          }}
          imageStyle={{
            opacity: 0.5
          }}
        >
          <SafeAreaView
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between'
            }}
          >
            <Pressable onPress={() => goBack()} style={styles.icon}>
              <Ionicons
                name="chevron-back-outline"
                color={theme.colors.white}
                size={20}
              />
            </Pressable>
            <Pressable onPress={() => goBack()} style={styles.icon}>
              <Ionicons
                name="share-outline"
                color={theme.colors.white}
                size={20}
                style={{ paddingLeft: 2, paddingBottom: 1 }}
              />
            </Pressable>
          </SafeAreaView>
        </ImageBackground>

        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Ticker
              number={profile.stats.totalFollowers}
              textStyle={styles.tickerText}
              textSize={18}
            />
            <Text style={styles.text}>followers</Text>
          </View>
          <SharedElement
            style={{ marginTop: -(height * 0.07) }}
            id={`profile.${profile.handle}`}
          >
            <UserProfile
              profile={profile}
              size={100}
              radius={20}
              showHandle={false}
            />
          </SharedElement>
          <View style={styles.stat}>
            <Ticker
              number={profile.stats.totalCollects}
              textStyle={styles.tickerText}
              textSize={18}
            />
            <Text style={styles.text}>collects</Text>
          </View>
        </View>

        <View style={{ paddingHorizontal: 10 }}>
          {isOwned && (
            <Text style={[styles.handle, { opacity: 0.5 }]}>gm,</Text>
          )}
          <Animated.Text
            style={styles.handle}
            entering={FadeInRight.duration(500)}
            numberOfLines={1}
          >
            {trimLensHandle(profile.handle)}
          </Animated.Text>

          <Pressable onPress={() => setShowMoreBio(!showMoreBio)}>
            <Animated.Text
              numberOfLines={!showMoreBio ? 2 : undefined}
              style={styles.bio}
              entering={FadeInRight.delay(200).duration(500)}
            >
              {showMoreBio ? profile.bio : trimNewLines(profile.bio ?? '')}
            </Animated.Text>
          </Pressable>

          <OnChainIdentities identity={profile.onChainIdentity} />
        </View>
      </Animated.View>
    </Animated.View>
  )
}

export default memo(Info)
