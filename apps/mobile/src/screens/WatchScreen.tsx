import type { Publication } from '@lenstube/lens'
import { usePublicationDetailsQuery } from '@lenstube/lens'
import React from 'react'
import { ActivityIndicator, SafeAreaView, StyleSheet } from 'react-native'

import MoreVideos from '~/components/watch/MoreVideos'
import VideoPlayer from '~/components/watch/Player'
import { theme } from '~/helpers/theme'
import useMobileStore from '~/store'

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1,
    backgroundColor: theme.colors.black
  }
})

export const WatchScreen = (props: WatchScreenProps) => {
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
    <SafeAreaView style={styles.container}>
      <VideoPlayer video={video} />
      <MoreVideos video={video} />
    </SafeAreaView>
  )
}
