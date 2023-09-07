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
import React, { memo, useCallback, useMemo } from 'react'
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
import { useMobilePersistStore } from '~/store/persist'

import AnimatedPressable from '../ui/AnimatedPressable'

const BORDER_RADIUS = 100

const styles = (themeConfig: MobileThemeConfig) =>
  StyleSheet.create({
    cardContainer: {
      display: 'flex',
      borderRadius: BORDER_RADIUS
    },
    card: {
      gap: 8,
      paddingVertical: 7,
      paddingHorizontal: 9,
      paddingRight: 14,
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

const SwitchProfile = () => {
  const { themeConfig } = useMobileTheme()
  const style = styles(themeConfig)

  const selectedChannelId = useMobilePersistStore(
    (state) => state.selectedChannelId
  )
  const selectedChannel = useMobileStore((state) => state.selectedChannel)
  const setSelectedChannel = useMobileStore((state) => state.setSelectedChannel)
  const setSelectedChannelId = useMobilePersistStore(
    (state) => state.setSelectedChannelId
  )

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
                : `${themeConfig.borderColor}60`,
            borderRadius: BORDER_RADIUS
          }}
          imageStyle={{
            opacity: 0.2,
            borderRadius: BORDER_RADIUS
          }}
        >
          <AnimatedPressable
            key={profile.id}
            style={style.card}
            onPress={() => {
              haptic()
              setSelectedChannelId(profile.id)
              setSelectedChannel(profile)
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
    [
      selectedChannel,
      setSelectedChannel,
      themeConfig,
      style,
      setSelectedChannelId
    ]
  )

  const { data, loading, error } = useAllProfilesQuery({
    variables: {
      request: { ownedBy: [selectedChannel?.ownedBy] }
    }
  })

  const profiles = useMemo(() => {
    if (data?.profiles?.items.length) {
      let items = [...data?.profiles?.items] as Profile[]
      const targetIndex = items.findIndex((p) => p.id === selectedChannelId)
      if (targetIndex !== -1) {
        items.unshift(items.splice(targetIndex, 1)[0])
      }
      return items
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

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
        contentContainerStyle={{ gap: 7 }}
      >
        {profiles
          ? profiles?.map((profile) => renderItem({ profile }))
          : renderItem({ profile: selectedChannel })}
      </ScrollView>
    </Skeleton>
  )
}

export default memo(SwitchProfile)
