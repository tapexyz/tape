import { LENS_CUSTOM_FILTERS } from '@lenstube/constants'
import {
  type Profile,
  type Publication,
  PublicationMainFocus,
  PublicationTypes,
  useProfilePostsQuery
} from '@lenstube/lens'
import type { FC } from 'react'
import React, { memo, useCallback } from 'react'
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native'
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  useWindowDimensions,
  View
} from 'react-native'
import Animated from 'react-native-reanimated'

import RenderPublication from '~/components/common/RenderPublication'
import normalizeFont from '~/helpers/normalize-font'
import { theme } from '~/helpers/theme'

type Props = {
  profile: Profile
  scrollHandler: (event: NativeSyntheticEvent<NativeScrollEvent>) => void
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 5,
    flex: 1
  },
  subheading: {
    fontFamily: 'font-normal',
    color: theme.colors.white,
    opacity: 0.8,
    fontSize: normalizeFont(13),
    paddingBottom: 20
  }
})

const Clan: FC<Props> = ({ profile, scrollHandler }) => {
  const { height } = useWindowDimensions()

  const request = {
    publicationTypes: [PublicationTypes.Post],
    limit: 10,
    metadata: {
      mainContentFocus: [
        PublicationMainFocus.Article,
        PublicationMainFocus.TextOnly,
        PublicationMainFocus.Image,
        PublicationMainFocus.Link
      ]
    },
    customFilters: LENS_CUSTOM_FILTERS,
    profileId: profile?.id
  }

  const { data, loading, fetchMore, refetch } = useProfilePostsQuery({
    variables: {
      request
    },
    skip: !profile?.id
  })

  const publications = data?.publications?.items as Publication[]
  const pageInfo = data?.publications?.pageInfo

  const fetchMorePublications = async () => {
    await fetchMore({
      variables: {
        request: {
          ...request,
          cursor: pageInfo?.next
        }
      }
    })
  }

  const renderItem = useCallback(
    ({ item }: { item: Publication }) => (
      <View style={{ marginBottom: 30 }}>
        <RenderPublication publication={item} />
      </View>
    ),
    []
  )

  return (
    <View style={[styles.container, { height }]}>
      <Text style={styles.subheading}>
        Dedicated corner to connect, swap stories, and get hyped about what we
        do!
      </Text>
      <Animated.FlatList
        data={publications}
        contentContainerStyle={{
          paddingBottom: publications?.length < 5 ? 500 : 180
        }}
        renderItem={renderItem}
        keyExtractor={(item, i) => `${item.id}_${i}`}
        ListFooterComponent={() =>
          loading && <ActivityIndicator style={{ paddingVertical: 20 }} />
        }
        onEndReached={fetchMorePublications}
        onEndReachedThreshold={0.8}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        onRefresh={() => refetch()}
        refreshing={Boolean(publications?.length) && loading}
      />
    </View>
  )
}

export default memo(Clan)
