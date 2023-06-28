import {
  getProfilePicture,
  getPublicationHlsUrl,
  getRelativeTime,
  getThumbnailUrl,
  trimLensHandle
} from '@lenstube/generic'
import type { Publication } from '@lenstube/lens'
import { usePublicationDetailsQuery } from '@lenstube/lens'
import { ResizeMode, Video } from 'expo-av'
import { Image as ExpoImage } from 'expo-image'
import React, { useState } from 'react'
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native'

import normalizeFont from '~/helpers/normalize-font'
import { theme } from '~/helpers/theme'
import useMobileStore from '~/store'

import Timeline from '../Timeline'

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1,
    backgroundColor: theme.colors.black
  },
  text: {
    fontFamily: 'font-medium',
    fontSize: normalizeFont(20),
    letterSpacing: 2,
    color: theme.colors.white
  },
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

const WatchVideoModal = (props: WatchVideoScreenProps) => {
  const videoId = props.route.params.id
  const [showMore, setShowMore] = useState(false)

  const selectedChannel = useMobileStore((state) => state.selectedChannel)

  const { data, error, loading } = usePublicationDetailsQuery({
    variables: {
      request: { publicationId: videoId },
      reactionRequest: selectedChannel
        ? { profileId: selectedChannel?.id }
        : null,
      channelId: selectedChannel?.id ?? null
    },
    skip: !videoId
  })
  const publication = data?.publication as Publication
  const video =
    publication?.__typename === 'Mirror' ? publication.mirrorOf : publication

  if (error) {
    return null
  }
  if (loading || !data) {
    return <ActivityIndicator style={{ flex: 1 }} />
  }

  return (
    <SafeAreaView style={styles.container}>
      <Video
        usePoster
        shouldPlay
        useNativeControls
        isMuted={false}
        isLooping={false}
        resizeMode={ResizeMode.CONTAIN}
        source={{
          uri: getPublicationHlsUrl(video)
        }}
        posterSource={{ uri: getThumbnailUrl(video) }}
        style={{
          width: '100%',
          aspectRatio: 16 / 9,
          backgroundColor: theme.colors.backdrop
        }}
      />

      <ScrollView>
        <View style={{ paddingVertical: 15, paddingHorizontal: 5 }}>
          <Text style={styles.title}>{video.metadata.name}</Text>
          {video.metadata.description && (
            <Pressable onPress={() => setShowMore(!showMore)}>
              <Text
                numberOfLines={!showMore ? 3 : undefined}
                style={styles.description}
              >
                {video.metadata.description.replace('\n', '')}
              </Text>
            </Pressable>
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
        <Timeline />
      </ScrollView>
    </SafeAreaView>
  )
}

export default WatchVideoModal
