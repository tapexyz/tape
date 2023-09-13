import Ionicons from '@expo/vector-icons/Ionicons'
import type { BottomSheetModal } from '@gorhom/bottom-sheet'
import {
  formatNumber,
  getChannelCoverPicture,
  imageCdn,
  sanitizeDStorageUrl,
  trimLensHandle,
  trimNewLines
} from '@lenstube/generic'
import type { Profile } from '@lenstube/lens'
import type { MobileThemeConfig } from '@lenstube/lens/custom-types'
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
  interpolate,
  useAnimatedStyle
} from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'

import haptic from '~/helpers/haptic'
import normalizeFont from '~/helpers/normalize-font'
import { windowWidth } from '~/helpers/theme'
import { useMobileTheme } from '~/hooks'
import { useMobilePersistStore } from '~/store/persist'

import UserProfile from '../common/UserProfile'
import Button from '../ui/Button'
import OnChainInfo from './OnChainInfo'
import ShareSheet from './ShareSheet'

type Props = {
  profile: Profile
  infoHeaderHeight: number
  contentScrollY: SharedValue<number>
  setInfoHeaderHeight: Dispatch<number>
}

const styles = (themeConfig: MobileThemeConfig) =>
  StyleSheet.create({
    iconButton: {
      backgroundColor: themeConfig.buttonBackgroundColor,
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
      color: themeConfig.textColor,
      opacity: 0.8
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      paddingVertical: 15
    },
    stat: {
      flexDirection: 'column',
      width: windowWidth * 0.3,
      alignItems: 'center'
    },
    tickerText: {
      fontFamily: 'font-bold',
      color: themeConfig.textColor,
      fontSize: normalizeFont(14),
      letterSpacing: 1
    },
    handle: {
      fontFamily: 'font-bold',
      color: themeConfig.textColor,
      fontSize: normalizeFont(35),
      letterSpacing: 0.6
    },
    bio: {
      fontFamily: 'font-medium',
      fontSize: normalizeFont(13),
      color: themeConfig.secondaryTextColor
    }
  })

const Info: FC<Props> = (props) => {
  const { profile, contentScrollY, infoHeaderHeight, setInfoHeaderHeight } =
    props
  const { goBack } = useNavigation()
  const { height } = useWindowDimensions()
  const { themeConfig } = useMobileTheme()
  const style = styles(themeConfig)

  const shareSheetRef = useRef<BottomSheetModal>(null)
  const [showMoreBio, setShowMoreBio] = useState(false)

  const selectedProfile = useMobilePersistStore(
    (state) => state.selectedProfile
  )
  const isOwned = selectedProfile?.id === profile.id

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
      <View
        style={{
          paddingBottom: 10
        }}
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
          {Boolean(infoHeaderHeight) ? (
            <SafeAreaView
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between'
              }}
            >
              <ShareSheet sheetRef={shareSheetRef} profile={profile} />

              <Pressable
                onPress={() => {
                  haptic()
                  goBack()
                }}
                style={style.iconButton}
              >
                <Ionicons
                  name="chevron-back-outline"
                  color={themeConfig.buttonTextColor}
                  size={20}
                />
              </Pressable>
              <Pressable
                onPress={() => {
                  haptic()
                  shareSheetRef.current?.present()
                }}
                style={style.iconButton}
              >
                <Ionicons
                  name="share-outline"
                  color={themeConfig.buttonTextColor}
                  size={20}
                  style={{ paddingLeft: 2, paddingBottom: 1 }}
                />
              </Pressable>
            </SafeAreaView>
          ) : null}
        </ImageBackground>

        <View style={style.statsContainer}>
          <View style={style.stat}>
            <Text style={style.tickerText}>
              {formatNumber(profile.stats.totalFollowers)}
            </Text>
            <Text style={style.text}>followers</Text>
          </View>
          <View style={{ marginTop: -(height * 0.07) }}>
            <UserProfile
              size={100}
              radius={20}
              profile={profile}
              showHandle={false}
              pressable={false}
            />
          </View>
          <View style={style.stat}>
            <Text style={style.tickerText}>
              {formatNumber(profile.stats.totalCollects)}
            </Text>
            <Text style={style.text}>collects</Text>
          </View>
        </View>

        <View style={{ paddingHorizontal: 10, gap: 15 }}>
          <View>
            <Text style={style.handle} numberOfLines={1}>
              {isOwned && (
                <Text style={[style.handle, { opacity: 0.5 }]}>gm, </Text>
              )}
              {trimLensHandle(profile.handle)}
            </Text>

            <Pressable onPress={() => setShowMoreBio(!showMoreBio)}>
              <Text numberOfLines={!showMoreBio ? 2 : 10} style={style.bio}>
                {showMoreBio ? profile.bio : trimNewLines(profile.bio ?? '')}
              </Text>
            </Pressable>
          </View>

          <OnChainInfo identity={profile.onChainIdentity} />

          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ flex: 1 }}>
              <Button text="Follow" size="sm" onPress={() => haptic()} />
            </View>
            <Button
              style={{ flex: 1, justifyContent: 'center' }}
              icon={
                <Ionicons
                  name="ellipsis-vertical-outline"
                  color={themeConfig.buttonTextColor}
                  size={16}
                />
              }
              size="sm"
              onPress={() => {
                haptic()
              }}
            />
          </View>
        </View>
      </View>
    </Animated.View>
  )
}

export default memo(Info)
