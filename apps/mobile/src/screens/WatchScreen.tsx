import type { Publication } from '@lenstube/lens'
import { usePublicationDetailsQuery } from '@lenstube/lens'
import React from 'react'
import {
  ActivityIndicator,
  StyleSheet,
  useWindowDimensions,
  View
} from 'react-native'
import * as Animatable from 'react-native-animatable'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { SharedElement } from 'react-navigation-shared-element'

import MoreVideos from '~/components/watch/MoreVideos'
import VideoPlayer from '~/components/watch/Player'
import { theme } from '~/helpers/theme'
import useMobileStore from '~/store'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.black
  }
})

export const WatchScreen = (props: WatchScreenProps) => {
  const { top, bottom } = useSafeAreaInsets()
  const { height: windowHeight } = useWindowDimensions()

  const videoId = props.route.params.id
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
    return <ActivityIndicator style={styles.container} />
  }

  return (
    <View style={[styles.container, { top, bottom }]}>
      <SharedElement id={`video.watch.${video.id}.thumbnail`}>
        <VideoPlayer video={video} />
      </SharedElement>

      <Animatable.View
        style={{ height: windowHeight }}
        useNativeDriver
        animation={{
          0: {
            opacity: 0,
            translateY: 50
          },
          1: {
            opacity: 1,
            translateY: 0
          }
        }}
        delay={300}
      >
        <MoreVideos video={video} />
      </Animatable.View>
    </View>
  )
}
