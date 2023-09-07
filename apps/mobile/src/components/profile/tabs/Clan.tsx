import { LENS_CUSTOM_FILTERS } from '@lenstube/constants'
import { trimLensHandle } from '@lenstube/generic'
import type {
  Profile,
  Publication,
  PublicationsQueryRequest
} from '@lenstube/lens'
import {
  PublicationMainFocus,
  PublicationTypes,
  useProfilePostsQuery
} from '@lenstube/lens'
import type { MobileThemeConfig } from '@lenstube/lens/custom-types'
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
import NotFound from '~/components/ui/NotFound'
import normalizeFont from '~/helpers/normalize-font'
import { useMobileTheme } from '~/hooks'

type Props = {
  profile: Profile
  scrollHandler: (event: NativeSyntheticEvent<NativeScrollEvent>) => void
}

const styles = (themeConfig: MobileThemeConfig) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 10,
      flex: 1
    },
    subheading: {
      fontFamily: 'font-medium',
      color: themeConfig.secondaryTextColor,
      fontSize: normalizeFont(13),
      paddingBottom: 20
    }
  })

const Clan: FC<Props> = ({ profile, scrollHandler }) => {
  const { height } = useWindowDimensions()
  const { themeConfig } = useMobileTheme()
  const style = styles(themeConfig)

  const request: PublicationsQueryRequest = {
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
    skip: !profile?.id,
    notifyOnNetworkStatusChange: true
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
    <View style={[style.container, { height }]}>
      <Animated.FlatList
        ListHeaderComponent={
          <Text style={style.subheading}>
            Dedicated corner to connect, swap stories, and get hyped about what{' '}
            {trimLensHandle(profile.handle)} do!
          </Text>
        }
        data={publications}
        contentContainerStyle={{
          paddingBottom: publications?.length < 5 ? 500 : 180
        }}
        renderItem={renderItem}
        keyExtractor={(item, i) => `${item.id}_${i}`}
        ListFooterComponent={() =>
          loading && <ActivityIndicator style={{ paddingVertical: 20 }} />
        }
        ListEmptyComponent={() => !loading && <NotFound />}
        onEndReached={pageInfo?.next ? fetchMorePublications : null}
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
