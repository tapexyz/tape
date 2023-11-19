import { RECS_URL, STATIC_ASSETS } from '@dragverse/constants'
import { imageCdn } from '@dragverse/generic'
import type {
    AnyPublication,
    MirrorablePublication,
    PublicationsRequest
} from '@dragverse/lens'
import { LimitType, usePublicationsQuery } from '@dragverse/lens'
import type { MobileThemeConfig } from '@dragverse/lens/custom-types'
import { FlashList } from '@shopify/flash-list'
import { Image as ExpoImage } from 'expo-image'
import type { FC } from 'react'
import React, { useCallback, useMemo } from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import useSWR from 'swr'

import normalizeFont from '~/helpers/normalize-font'
import { useMobileTheme } from '~/hooks'

import AudioCard from '../common/AudioCard'
import VideoCard from '../common/VideoCard'
import NotFound from '../ui/NotFound'
import Actions from './Actions'
import Comments from './Comments'
import Metadata from './Metadata'

const styles = (themeConfig: MobileThemeConfig) =>
  StyleSheet.create({
    titleContainer: {
      paddingVertical: 20,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 7,
      borderRadius: 25
    },
    title: {
      fontFamily: 'font-bold',
      color: themeConfig.textColor,
      fontSize: normalizeFont(14)
    },
    image: {
      width: 30,
      height: 30
    }
  })

type Props = {
  video: AnyPublication
}

const RecommendedTitle = () => {
  const { themeConfig } = useMobileTheme()
  const style = styles(themeConfig)

  return (
    <View style={style.titleContainer}>
      <ExpoImage
        source={{
          uri: imageCdn(
            `${STATIC_ASSETS}/mobile/icons/recommended.png`,
            'AVATAR'
          )
        }}
        style={style.image}
      />
      <Text style={style.title}>Recommended</Text>
    </View>
  )
}

const MoreVideos: FC<Props> = ({ video }) => {
  const { data: recsData, isLoading: recsLoading } = useSWR(
    `${RECS_URL}/k3l-feed/recommended?exclude=${video.id}`,
    (url: string) => fetch(url).then((res) => res.json())
  )

  const publicationIds = recsData?.items as string[]

  const request: PublicationsRequest = {
    where: {
      publicationIds
    },
    limit: LimitType.TwentyFive
  }

  const { data, loading } = usePublicationsQuery({
    variables: { request },
    skip: !publicationIds,
    fetchPolicy: 'no-cache'
  })

  const publications = data?.publications?.items as MirrorablePublication[]

  const renderItem = useCallback(
    ({ item }: { item: MirrorablePublication }) => (
      <View style={{ marginBottom: 30 }}>
        {item.metadata.__typename === 'AudioMetadataV3' ? (
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
        paddingHorizontal: 10,
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
        ListEmptyComponent={() => !loading && <NotFound />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

export default MoreVideos
