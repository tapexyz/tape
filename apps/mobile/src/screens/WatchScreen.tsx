import type { Publication } from '@lenstube/lens'
import { usePublicationDetailsQuery } from '@lenstube/lens'
import React from 'react'
import {
  ActivityIndicator,
  StyleSheet,
  useWindowDimensions,
  View
} from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { SharedElement } from 'react-navigation-shared-element'

import ServerError from '~/components/ui/ServerError'
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
    return <ServerError />
  }
  if (loading || !data) {
    return <ActivityIndicator style={styles.container} />
  }

  return (
    <View style={[styles.container, { top, bottom }]}>
      <SharedElement id={`video.watch.${video.id}.thumbnail`}>
        <VideoPlayer video={video} />
      </SharedElement>

      <Animated.View
        style={{ height: windowHeight }}
        entering={FadeInDown.duration(500)}
      >
        <MoreVideos video={video} />
      </Animated.View>
    </View>
  )
}
