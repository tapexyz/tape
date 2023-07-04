import {
  getProfilePicture,
  getRelativeTime,
  getThumbnailUrl,
  trimLensHandle
} from '@lenstube/generic'
import type { Publication } from '@lenstube/lens'
import { useNavigation } from '@react-navigation/native'
import { Image as ExpoImage } from 'expo-image'
import type { FC } from 'react'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

import normalizeFont from '~/helpers/normalize-font'
import { theme } from '~/helpers/theme'

import AnimatedPressable from '../ui/AnimatedPressable'

type Props = {
  video: Publication
}

const styles = StyleSheet.create({
  title: {
    color: theme.colors.primary,
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
    borderRadius: 10,
    backgroundColor: theme.colors.backdrop
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
    color: theme.colors.primary
  }
})

const VideoCard: FC<Props> = ({ video }) => {
  const thumbnailUrl = getThumbnailUrl(video)
  const { navigate } = useNavigation()

  return (
    <AnimatedPressable onPress={() => navigate('WatchVideo', { id: video.id })}>
      <ExpoImage
        source={thumbnailUrl}
        contentFit="cover"
        style={styles.thumbnail}
      />
      <View style={{ paddingVertical: 15, paddingHorizontal: 5 }}>
        <Text style={styles.title}>{video.metadata.name}</Text>
        {video.metadata.description && (
          <Text numberOfLines={3} style={styles.description}>
            {video.metadata.description.replace('\n', '')}
          </Text>
        )}
        <View style={styles.otherInfoContainer}>
          <ExpoImage
            source={getProfilePicture(video.profile)}
            contentFit="cover"
            style={{ width: 15, height: 15, borderRadius: 3 }}
          />
          <Text style={styles.otherInfo}>
            {trimLensHandle(video.profile.handle)}
          </Text>
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
    </AnimatedPressable>
  )
}

export default VideoCard
