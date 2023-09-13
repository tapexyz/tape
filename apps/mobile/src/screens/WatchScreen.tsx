import type { Publication } from '@lenstube/lens'
import { usePublicationDetailsQuery } from '@lenstube/lens'
import type { MobileThemeConfig } from '@lenstube/lens/custom-types'
import React from 'react'
import {
  ActivityIndicator,
  StyleSheet,
  useWindowDimensions
} from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'

import ServerError from '~/components/ui/ServerError'
import MoreVideos from '~/components/watch/MoreVideos'
import VideoPlayer from '~/components/watch/Player'
import { useMobileTheme } from '~/hooks'
import { useMobilePersistStore } from '~/store/persist'

const styles = (themeConfig: MobileThemeConfig) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themeConfig.backgroudColor
    }
  })

export const WatchScreen = (props: WatchScreenProps) => {
  const { themeConfig } = useMobileTheme()
  const style = styles(themeConfig)

  const { height: windowHeight } = useWindowDimensions()

  const videoId = props.route.params.id
  const selectedProfile = useMobilePersistStore(
    (state) => state.selectedProfile
  )

  const { data, error, loading } = usePublicationDetailsQuery({
    variables: {
      request: { publicationId: videoId },
      reactionRequest: selectedProfile
        ? { profileId: selectedProfile?.id }
        : null,
      channelId: selectedProfile?.id ?? null
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
    return <ActivityIndicator style={style.container} />
  }

  return (
    <SafeAreaView style={style.container}>
      <VideoPlayer video={video} />

      <Animated.View style={{ height: windowHeight }} entering={FadeInDown}>
        <MoreVideos video={video} />
      </Animated.View>
    </SafeAreaView>
  )
}
