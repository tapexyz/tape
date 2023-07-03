import type { Publication } from '@lenstube/lens'
import { usePublicationDetailsQuery } from '@lenstube/lens'
import React from 'react'
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet
} from 'react-native'

import Actions from '~/components/watch/Actions'
import Comments from '~/components/watch/Comments'
import Metadata from '~/components/watch/Metadata'
import VideoPlayer from '~/components/watch/Player'
import normalizeFont from '~/helpers/normalize-font'
import { theme } from '~/helpers/theme'
import useMobileStore from '~/store'

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
  }
})

const WatchVideoModal = (props: WatchVideoScreenProps) => {
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

      <ScrollView>
        <Metadata video={video} />
        <Actions video={video} />
        <Comments video={video} />
      </ScrollView>
    </SafeAreaView>
  )
}

export default WatchVideoModal
