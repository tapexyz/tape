import {
  getShortHandTime,
  getThumbnailUrl,
  imageCdn,
  trimify
} from '@lenstube/generic'
import type { Publication } from '@lenstube/lens'
import type { MobileThemeConfig } from '@lenstube/lens/custom-types'
import { Image as ExpoImage } from 'expo-image'
import type { FC } from 'react'
import React from 'react'
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native'

import UserProfile from '~/components/common/UserProfile'
import normalizeFont from '~/helpers/normalize-font'
import { useMobileTheme } from '~/hooks'

const BORDER_RADIUS = 25

const styles = (themeConfig: MobileThemeConfig) =>
  StyleSheet.create({
    poster: {
      borderRadius: BORDER_RADIUS,
      aspectRatio: 1 / 1,
      borderColor: themeConfig.borderColor,
      borderWidth: 0.5
    },
    title: {
      color: themeConfig.textColor,
      fontFamily: 'font-bold',
      fontSize: normalizeFont(14),
      letterSpacing: 0.5,
      textAlign: 'center'
    },
    description: {
      fontFamily: 'font-normal',
      fontSize: normalizeFont(12),
      color: themeConfig.secondaryTextColor,
      paddingTop: 10
    },
    thumbnail: {
      width: '100%',
      height: 215,
      borderRadius: BORDER_RADIUS,
      borderColor: themeConfig.borderColor,
      borderWidth: 0.5
    },
    otherInfoContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingTop: 10,
      opacity: 0.8
    },
    otherInfo: {
      fontFamily: 'font-normal',
      fontSize: normalizeFont(10),
      color: themeConfig.textColor
    }
  })

type Props = {
  audio: Publication
}

const Item: FC<Props> = ({ audio }) => {
  const { width } = useWindowDimensions()
  const { themeConfig } = useMobileTheme()
  const style = styles(themeConfig)

  return (
    <View style={{ width }}>
      <View
        style={{
          paddingHorizontal: 15,
          alignItems: 'center'
        }}
      >
        <Text numberOfLines={1} style={style.title}>
          {trimify(audio.metadata.name ?? '')}
        </Text>
        <View style={style.otherInfoContainer}>
          <UserProfile profile={audio.profile} size={15} radius={3} />
          <Text style={{ color: themeConfig.secondaryTextColor, fontSize: 3 }}>
            {'\u2B24'}
          </Text>
          <Text style={style.otherInfo}>{audio.stats.totalUpvotes} likes</Text>
          <Text style={{ color: themeConfig.secondaryTextColor, fontSize: 3 }}>
            {'\u2B24'}
          </Text>
          <Text style={style.otherInfo}>
            {getShortHandTime(audio.createdAt)}
          </Text>
        </View>
      </View>
      <View
        style={{
          paddingTop: 20,
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <View style={[style.poster, { height: width * 0.6 }]}>
          <ExpoImage
            source={{
              uri: imageCdn(getThumbnailUrl(audio), 'SQUARE')
            }}
            transition={300}
            contentFit="cover"
            style={[style.poster, { height: width * 0.6 }]}
          />
        </View>
      </View>
    </View>
  )
}

export default Item
