import Ionicons from '@expo/vector-icons/Ionicons'
import { LENSTUBE_BYTES_APP_ID, STATIC_ASSETS } from '@lenstube/constants'
import {
  getIsSensitiveContent,
  getRelativeTime,
  getThumbnailUrl,
  getTimeFromSeconds,
  getValueFromTraitType,
  imageCdn,
  trimify,
  trimNewLines
} from '@lenstube/generic'
import type { Attribute, Publication } from '@lenstube/lens'
import { useNavigation } from '@react-navigation/native'
import { Image as ExpoImage } from 'expo-image'
import type { FC } from 'react'
import React, { memo } from 'react'
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native'

import normalizeFont from '~/helpers/normalize-font'
import { theme } from '~/helpers/theme'

import UserProfile from './UserProfile'

type Props = {
  video: Publication
}

const BORDER_RADIUS = 10

const styles = StyleSheet.create({
  title: {
    color: theme.colors.white,
    fontFamily: 'font-bold',
    fontSize: normalizeFont(13),
    letterSpacing: 0.5
  },
  description: {
    fontFamily: 'font-normal',
    fontSize: normalizeFont(12),
    color: theme.colors.secondary,
    paddingTop: 10
  },
  thumbnail: {
    width: '100%',
    height: 215,
    borderRadius: BORDER_RADIUS,
    borderColor: theme.colors.grey,
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
    color: theme.colors.white
  },
  duration: {
    position: 'absolute',
    bottom: 7,
    right: 7,
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 3,
    backgroundColor: theme.colors.black
  },
  sensitive: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    top: 7,
    right: 7,
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 3,
    backgroundColor: theme.colors.black
  }
})

const VideoCard: FC<Props> = ({ video }) => {
  const { navigate } = useNavigation()

  const isBytes = video.appId === LENSTUBE_BYTES_APP_ID
  const isSensitiveContent = getIsSensitiveContent(video?.metadata, video.id)
  const thumbnailUrl = imageCdn(
    isSensitiveContent
      ? `${STATIC_ASSETS}/images/sensor-blur.png`
      : getThumbnailUrl(video, true),
    isBytes ? 'THUMBNAIL_V' : 'THUMBNAIL'
  )
  const videoDuration = getValueFromTraitType(
    video.metadata?.attributes as Attribute[],
    'durationInSeconds'
  )

  return (
    <Pressable onPress={() => navigate('WatchVideo', { id: video.id })}>
      <ImageBackground
        source={{ uri: thumbnailUrl }}
        blurRadius={15}
        imageStyle={{
          opacity: 0.8,
          borderRadius: BORDER_RADIUS
        }}
      >
        <ExpoImage
          source={{ uri: thumbnailUrl }}
          transition={300}
          contentFit={isBytes ? 'contain' : 'cover'}
          style={styles.thumbnail}
        />
        {videoDuration && (
          <View style={styles.duration}>
            <Text style={styles.otherInfo}>
              {getTimeFromSeconds(videoDuration)}
            </Text>
          </View>
        )}
        {isSensitiveContent && (
          <View style={styles.sensitive}>
            <Ionicons
              name="eye-off-outline"
              color={theme.colors.white}
              size={10}
            />
            <Text style={styles.otherInfo}>Sensitive</Text>
          </View>
        )}
      </ImageBackground>

      <View style={{ paddingVertical: 15, paddingHorizontal: 5 }}>
        <Text numberOfLines={3} style={styles.title}>
          {trimify(video.metadata.name ?? '')}
        </Text>
        {video.metadata.description && (
          <Text numberOfLines={3} style={styles.description}>
            {trimNewLines(video.metadata.description)}
          </Text>
        )}
        <View style={styles.otherInfoContainer}>
          <UserProfile profile={video.profile} size={15} radius={3} />
          <Text style={{ color: theme.colors.secondary, fontSize: 3 }}>
            {'\u2B24'}
          </Text>
          <Text style={styles.otherInfo}>{video.stats.totalUpvotes} likes</Text>
          <Text style={{ color: theme.colors.secondary, fontSize: 3 }}>
            {'\u2B24'}
          </Text>
          <Text style={styles.otherInfo}>
            {getRelativeTime(video.createdAt)}
          </Text>
        </View>
      </View>
    </Pressable>
  )
}

export default memo(VideoCard)
