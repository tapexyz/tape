import Ionicons from '@expo/vector-icons/Ionicons'
import type { Publication } from '@lenstube/lens'
import { usePublicationDetailsQuery } from '@lenstube/lens'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import Actions from '~/components/watch/Actions'
import Comments from '~/components/watch/Comments'
import Metadata from '~/components/watch/Metadata'
import MoreVideos from '~/components/watch/MoreVideos'
import VideoPlayer from '~/components/watch/Player'
import haptic from '~/helpers/haptic'
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
  },
  close: {
    position: 'absolute',
    backgroundColor: theme.colors.grey,
    borderRadius: 100,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
    height: 30,
    right: 5,
    zIndex: 1
  }
})

export const WatchVideoScreen = (props: WatchVideoScreenProps) => {
  const videoId = props.route.params.id
  const { goBack } = useNavigation()
  const { top: topInset } = useSafeAreaInsets()

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
      <Pressable
        onPress={() => {
          haptic()
          goBack()
        }}
        style={[styles.close, { top: topInset + 5 }]}
      >
        <Ionicons name="close-outline" color={theme.colors.white} size={25} />
      </Pressable>

      <VideoPlayer video={video} />

      <ScrollView>
        <Metadata video={video} />
        <Actions video={video} />
        <Comments videoId={video.id} />
        <MoreVideos viewingId={video.id} />
      </ScrollView>
    </SafeAreaView>
  )
}
