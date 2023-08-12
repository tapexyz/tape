import Ionicons from '@expo/vector-icons/Ionicons'
import type { BottomSheetModal } from '@gorhom/bottom-sheet'
import {
  getChannelCoverPicture,
  imageCdn,
  sanitizeDStorageUrl,
  trimLensHandle,
  trimNewLines
} from '@lenstube/generic'
import type { Profile } from '@lenstube/lens'
import { useNavigation } from '@react-navigation/native'
import type { Dispatch, FC } from 'react'
import React, { memo, useRef, useState } from 'react'
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
import { SafeAreaView } from 'react-native-safe-area-context'
import { SharedElement } from 'react-navigation-shared-element'

import haptic from '~/helpers/haptic'
import normalizeFont from '~/helpers/normalize-font'
import { theme, windowWidth } from '~/helpers/theme'
import useMobileStore from '~/store'

import UserProfile from '../common/UserProfile'
import Button from '../ui/Button'
import Ticker from '../ui/Ticker'
import OnChainIdentities from './OnChainIdentities'
import ShareSheet from './ShareSheet'

type Props = {
  profile: Profile
  infoHeaderHeight: number
  contentScrollY: SharedValue<number>
  setInfoHeaderHeight: Dispatch<number>
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

const Info: FC<Props> = (props) => {
  const { profile, contentScrollY, infoHeaderHeight, setInfoHeaderHeight } =
    props
  const { goBack } = useNavigation()
  const { height } = useWindowDimensions()
  const shareSheetRef = useRef<BottomSheetModal>(null)

  const selectedChannel = useMobileStore((state) => state.selectedChannel)
  const isOwned = selectedChannel?.id === profile.id

  const [showMoreBio, setShowMoreBio] = useState(false)

  const animatedHeaderStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            contentScrollY.value,
            [0, infoHeaderHeight * 2], // the value *2 is added to speed down the translateY timing
            [0, -infoHeaderHeight],
            Extrapolate.CLAMP
          )
        }
      ],
      opacity: interpolate(
        contentScrollY.value,
        [0, infoHeaderHeight / 2], // the value /3 is added to speed up the opacity timing
        [1, 0],
        Extrapolate.CLAMP
      ),
      height: infoHeaderHeight !== 0 ? infoHeaderHeight : undefined
    }
  })

  return (
    <Animated.View style={animatedHeaderStyle}>
      <Animated.View
        onLayout={(event) => {
          const { height } = event.nativeEvent.layout
          if (infoHeaderHeight !== height) {
            setInfoHeaderHeight(height)
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
            <ShareSheet sheetRef={shareSheetRef} profile={profile} />

            <Pressable onPress={() => goBack()} style={styles.icon}>
              <Ionicons
                name="chevron-back-outline"
                color={theme.colors.white}
                size={20}
              />
            </Pressable>
            <Pressable
              onPress={() => shareSheetRef.current?.present()}
              style={styles.icon}
            >
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
              size={100}
              radius={20}
              profile={profile}
              showHandle={false}
              pressable={false}
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

        <View style={{ paddingHorizontal: 10, gap: 20 }}>
          <View>
            {isOwned && (
              <Text style={[styles.handle, { opacity: 0.5 }]}>gm,</Text>
            )}
            <Animated.Text
              style={styles.handle}
              entering={FadeInRight.duration(300)}
              numberOfLines={1}
            >
              {trimLensHandle(profile.handle)}
            </Animated.Text>

            <Pressable onPress={() => setShowMoreBio(!showMoreBio)}>
              <Animated.Text
                numberOfLines={!showMoreBio ? 2 : undefined}
                style={styles.bio}
                entering={FadeInRight.delay(100).duration(300)}
              >
                {showMoreBio ? profile.bio : trimNewLines(profile.bio ?? '')}
              </Animated.Text>
            </Pressable>
          </View>

          <OnChainIdentities identity={profile.onChainIdentity} />

          <Animated.View
            style={{ flexDirection: 'row', gap: 10 }}
            entering={FadeInRight.duration(400)}
          >
            <View style={{ flex: 1 }}>
              <Button text="Follow" size="sm" onPress={() => haptic()} />
            </View>
            <Button
              icon={
                <Ionicons
                  name="ellipsis-vertical-outline"
                  color={theme.colors.white}
                  size={16}
                />
              }
              size="sm"
              onPress={() => {
                haptic()
              }}
            />
          </Animated.View>
        </View>
      </Animated.View>
    </Animated.View>
  )
}

export default memo(Info)
