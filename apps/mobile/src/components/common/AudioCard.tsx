import {
  getRelativeTime,
  getThumbnailUrl,
  getValueFromTraitType,
  imageCdn,
  trimify,
  trimNewLines
} from '@lenstube/generic'
import type { Attribute, Publication } from '@lenstube/lens'
import type { MobileThemeConfig } from '@lenstube/lens/custom-types'
import { useNavigation } from '@react-navigation/native'
import { Image as ExpoImage } from 'expo-image'
import type { FC } from 'react'
import React, { memo } from 'react'
import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View
} from 'react-native'

import normalizeFont from '~/helpers/normalize-font'
import { useMobileTheme } from '~/hooks'

import UserProfile from './UserProfile'
import WaveForm from './WaveForm'

type Props = {
  audio: Publication
}
const styles = (themeConfig: MobileThemeConfig) =>
  StyleSheet.create({
    title: {
      color: themeConfig.textColor,
      fontFamily: 'font-bold',
      fontSize: normalizeFont(13),
      letterSpacing: 0.5
    },
    description: {
      fontFamily: 'font-normal',
      fontSize: normalizeFont(12),
      color: themeConfig.secondaryTextColor
    },
    thumbnail: {
      borderRadius: 10,
      backgroundColor: themeConfig.sheetBackgroundColor,
      borderColor: themeConfig.borderColor,
      borderWidth: 1
    },
    otherInfoContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      opacity: 0.8,
      paddingTop: 10
    },
    otherInfo: {
      fontFamily: 'font-normal',
      fontSize: normalizeFont(10),
      color: themeConfig.textColor
    },
    author: {
      fontFamily: 'font-normal',
      fontSize: normalizeFont(12),
      color: themeConfig.secondaryTextColor,
      letterSpacing: 0.5
    },
    audioInfoContainer: {
      display: 'flex',
      flexDirection: 'column',
      paddingHorizontal: 15,
      justifyContent: 'space-between',
      width: '100%',
      flex: 1
    }
  })

const AudioCard: FC<Props> = ({ audio }) => {
  const { themeConfig } = useMobileTheme()
  const { navigate } = useNavigation()
  const { width } = useWindowDimensions()
  const thumbnailUrl = imageCdn(getThumbnailUrl(audio, true), 'AVATAR_LG')
  const style = styles(themeConfig)

  return (
    <Pressable onPress={() => navigate('WatchScreen', { id: audio.id })}>
      <>
        <View style={{ display: 'flex', flexDirection: 'row' }}>
          <ExpoImage
            source={{ uri: thumbnailUrl }}
            transition={300}
            contentFit="cover"
            style={[
              styles(themeConfig).thumbnail,
              { width: width / 3, height: width / 3 }
            ]}
          />
          <View style={style.audioInfoContainer}>
            <View style={{ gap: 5 }}>
              <Text style={style.title} numberOfLines={2}>
                {trimify(audio.metadata.name ?? '')}
              </Text>
              <Text style={style.author}>
                {getValueFromTraitType(
                  audio.metadata.attributes as Attribute[],
                  'author'
                )}
              </Text>
            </View>
            <WaveForm audio={audio} />
          </View>
        </View>
        <View style={{ paddingVertical: 10, paddingHorizontal: 5 }}>
          {audio.metadata.description && (
            <Text numberOfLines={3} style={style.description}>
              {trimNewLines(audio.metadata.description)}
            </Text>
          )}
          <View style={style.otherInfoContainer}>
            <UserProfile profile={audio.profile} size={15} radius={3} />
            <Text
              style={{ color: themeConfig.secondaryTextColor, fontSize: 3 }}
            >
              {'\u2B24'}
            </Text>
            <Text style={style.otherInfo}>
              {audio.stats.totalUpvotes} likes
            </Text>
            <Text
              style={{ color: themeConfig.secondaryTextColor, fontSize: 3 }}
            >
              {'\u2B24'}
            </Text>
            <Text style={style.otherInfo}>
              {getRelativeTime(audio.createdAt)}
            </Text>
          </View>
        </View>
      </>
    </Pressable>
  )
}

export default memo(AudioCard)
