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
import type { MobileThemeConfig } from '@lenstube/lens/custom-types'
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

import haptic from '~/helpers/haptic'
import normalizeFont from '~/helpers/normalize-font'
import { useMobileTheme } from '~/hooks'
import useMobileStore from '~/store'

import AnimatedPressable from '../ui/AnimatedPressable'

const BORDER_RADIUS = 100

const styles = (themeConfig: MobileThemeConfig) =>
  StyleSheet.create({
    cardContainer: {
      display: 'flex',
      backgroundColor: themeConfig.backgroudColor,
      borderRadius: BORDER_RADIUS
    },
    card: {
      gap: 8,
      paddingVertical: 7,
      paddingHorizontal: 14,
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: BORDER_RADIUS
    },
    otherInfo: {
      fontFamily: 'font-medium',
      fontSize: normalizeFont(10),
      color: themeConfig.textColor,
      opacity: 0.8
    },
    handle: {
      fontFamily: 'font-medium',
      fontSize: normalizeFont(12),
      color: themeConfig.textColor
    },
    profileImage: {
      width: 30,
      height: 30,
      borderRadius: BORDER_RADIUS
    }
  })

const Switch = () => {
  const { themeConfig } = useMobileTheme()
  const style = styles(themeConfig)

  const selectedChannel = useMobileStore((state) => state.selectedChannel)
  const setSelectedChannel = useMobileStore((state) => state.setSelectedChannel)

  const renderItem = useCallback(
    ({ profile }: { profile: Profile }) => (
      <View key={profile.id} style={style.cardContainer}>
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
                ? themeConfig.contrastBorderColor
                : themeConfig.borderColor,
            borderRadius: BORDER_RADIUS
          }}
          imageStyle={{
            opacity: 0.3,
            borderRadius: BORDER_RADIUS
          }}
        >
          <AnimatedPressable
            key={profile.id}
            style={style.card}
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
              style={style.profileImage}
            />
            <View>
              <Text numberOfLines={1} style={style.handle}>
                {trimLensHandle(profile.handle)}
              </Text>
              <Text style={style.otherInfo}>
                {formatNumber(profile.stats.totalFollowers)} followers
              </Text>
            </View>
          </AnimatedPressable>
        </ImageBackground>
      </View>
    ),
    [selectedChannel, setSelectedChannel, themeConfig, style]
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
      colors={[themeConfig.backgroudColor3, themeConfig.backgroudColor2]}
      radius={BORDER_RADIUS}
    >
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 7, paddingHorizontal: 10 }}
      >
        {profiles
          ? profiles?.map((profile) => renderItem({ profile }))
          : renderItem({ profile: selectedChannel })}
      </ScrollView>
    </Skeleton>
  )
}

export default Switch
