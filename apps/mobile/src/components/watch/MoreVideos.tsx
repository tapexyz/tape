import { RECS_URL, STATIC_ASSETS } from '@lenstube/constants'
import { imageCdn } from '@lenstube/generic'
import {
  type Publication,
  PublicationMainFocus,
  useProfilePostsQuery
} from '@lenstube/lens'
import { FlashList } from '@shopify/flash-list'
import { Image as ExpoImage } from 'expo-image'
import type { FC } from 'react'
import React, { useCallback, useMemo } from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import useSWR from 'swr'

import normalizeFont from '~/helpers/normalize-font'
import { theme } from '~/helpers/theme'
import { useMobilePersistStore } from '~/store/persist'

import AudioCard from '../common/AudioCard'
import VideoCard from '../common/VideoCard'
import Actions from './Actions'
import Comments from './Comments'
import Metadata from './Metadata'

const styles = StyleSheet.create({
  titleContainer: {
    paddingHorizontal: 5,
    paddingVertical: 20,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    borderRadius: 25
  },
  title: {
    fontFamily: 'font-bold',
    color: theme.colors.white,
    fontSize: normalizeFont(14)
  },
  image: {
    width: 30,
    height: 30
  }
})

type Props = {
  video: Publication
}

const RecommendedTitle = () => (
  <View style={styles.titleContainer}>
    <ExpoImage
      source={{
        uri: imageCdn(`${STATIC_ASSETS}/mobile/icons/recommended.png`, 'AVATAR')
      }}
      style={styles.image}
    />
    <Text style={styles.title}>Recommended</Text>
  </View>
)

const MoreVideos: FC<Props> = ({ video }) => {
  const selectedChannelId = useMobilePersistStore(
    (state) => state.selectedChannelId
  )

  const { data: recsData, isLoading: recsLoading } = useSWR(
    `${RECS_URL}/k3l-feed/recommended?exclude=${video.id}`,
    (url: string) => fetch(url).then((res) => res.json())
  )

  const publicationIds = recsData?.items as string[]

  const request = { publicationIds, limit: 20 }
  const reactionRequest = selectedChannelId
    ? { profileId: selectedChannelId }
    : null
  const channelId = selectedChannelId ?? null

  const { data, loading } = useProfilePostsQuery({
    variables: { request, reactionRequest, channelId },
    skip: !publicationIds,
    fetchPolicy: 'no-cache'
  })

  const publications = data?.publications?.items as Publication[]

  const renderItem = useCallback(
    ({ item }: { item: Publication }) => (
      <View style={{ marginBottom: 30 }}>
        {item.metadata.mainContentFocus === PublicationMainFocus.Audio ? (
          <AudioCard audio={item} />
        ) : (
          <VideoCard video={item} />
        )}
      </View>
    ),
    []
  )

  const HeaderComponent = useMemo(
    () => (
      <>
        <Metadata video={video} />
        <Actions video={video} />
        <Comments id={video.id} />
        <RecommendedTitle />
      </>
    ),
    [video]
  )

  if (loading || recsLoading) {
    return <ActivityIndicator style={{ flex: 1 }} />
  }

  if (!publications?.length) {
    return null
  }

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 5,
        marginBottom: 250
      }}
    >
      <FlashList
        ListHeaderComponent={HeaderComponent}
        data={publications}
        estimatedItemSize={publications.length}
        renderItem={renderItem}
        keyExtractor={(item, i) => `${item.id}_${i}`}
        ListFooterComponent={() =>
          loading && <ActivityIndicator style={{ paddingVertical: 20 }} />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

export default MoreVideos
