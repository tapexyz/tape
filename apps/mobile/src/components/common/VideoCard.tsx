import { LENSTUBE_BYTES_APP_ID } from '@lenstube/constants'
import {
  getProfilePicture,
  getRelativeTime,
  getThumbnailUrl,
  imageCdn,
  trimLensHandle
} from '@lenstube/generic'
import type { Publication } from '@lenstube/lens'
import { useNavigation } from '@react-navigation/native'
import { Image as ExpoImage } from 'expo-image'
import type { FC } from 'react'
import React from 'react'
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native'

import normalizeFont from '~/helpers/normalize-font'
import { theme } from '~/helpers/theme'

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
  }
})

const VideoCard: FC<Props> = ({ video }) => {
  const isBytes = video.appId === LENSTUBE_BYTES_APP_ID
  const thumbnailUrl = imageCdn(
    getThumbnailUrl(video, true),
    isBytes ? 'THUMBNAIL_V' : 'THUMBNAIL'
  )
  const { navigate } = useNavigation()

  return (
    <Pressable onPress={() => navigate('WatchVideo', { id: video.id })}>
      <>
        <ImageBackground
          source={{ uri: thumbnailUrl }}
          blurRadius={15}
          imageStyle={{ opacity: 0.8, borderRadius: BORDER_RADIUS }}
        >
          <ExpoImage
            source={{ uri: thumbnailUrl }}
            contentFit="contain"
            style={styles.thumbnail}
          />
        </ImageBackground>
        <View style={{ paddingVertical: 15, paddingHorizontal: 5 }}>
          <Text numberOfLines={3} style={styles.title}>
            {video.metadata.name}
          </Text>
          {video.metadata.description && (
            <Text numberOfLines={3} style={styles.description}>
              {video.metadata.description.replace('\n', '')}
            </Text>
          )}
          <View style={styles.otherInfoContainer}>
            <ExpoImage
              source={{ uri: imageCdn(getProfilePicture(video.profile)) }}
              contentFit="cover"
              style={{ width: 15, height: 15, borderRadius: 3 }}
            />
            <Text style={styles.otherInfo}>
              {trimLensHandle(video.profile.handle)}
            </Text>
            <Text style={{ color: theme.colors.secondary, fontSize: 3 }}>
              {'\u2B24'}
            </Text>
            <Text style={styles.otherInfo}>
              {video.stats.totalUpvotes} likes
            </Text>
            <Text style={{ color: theme.colors.secondary, fontSize: 3 }}>
              {'\u2B24'}
            </Text>
            <Text style={styles.otherInfo}>
              {getRelativeTime(video.createdAt)}
            </Text>
          </View>
        </View>
      </>
    </Pressable>
  )
}

export default VideoCard
