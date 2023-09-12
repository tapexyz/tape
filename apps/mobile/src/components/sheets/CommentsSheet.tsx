import type { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types'
import { LENS_CUSTOM_FILTERS } from '@lenstube/constants'
import {
  type Publication,
  type PublicationsQueryRequest,
  useCommentsQuery
} from '@lenstube/lens'
import type { MobileThemeConfig } from '@lenstube/lens/custom-types'
import { FlashList } from '@shopify/flash-list'
import type { FC } from 'react'
import React, { useCallback } from 'react'
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  useWindowDimensions,
  View
} from 'react-native'

import normalizeFont from '~/helpers/normalize-font'
import { useMobileTheme } from '~/hooks'

import NotFound from '../ui/NotFound'
import Sheet from '../ui/Sheet'
import Comment from '../watch/Comment'

type Props = {
  id: string
  commentsSheetRef: React.RefObject<BottomSheetModalMethods>
}

const styles = (themeConfig: MobileThemeConfig) =>
  StyleSheet.create({
    title: {
      fontFamily: 'font-bold',
      color: themeConfig.textColor,
      fontSize: normalizeFont(14),
      paddingBottom: 10
    }
  })

const CommentsSheet: FC<Props> = ({ id, commentsSheetRef }) => {
  const { height } = useWindowDimensions()
  const { themeConfig } = useMobileTheme()
  const style = styles(themeConfig)

  const request: PublicationsQueryRequest = {
    limit: 10,
    customFilters: LENS_CUSTOM_FILTERS,
    commentsOf: id
  }

  const { data, fetchMore, loading, refetch } = useCommentsQuery({
    variables: { request },
    skip: !id
  })
  const comments = data?.publications?.items as Publication[]
  const pageInfo = data?.publications?.pageInfo

  const fetchMoreComments = async () => {
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
      <View style={{ marginTop: 20 }}>
        <Comment comment={item} richText />
      </View>
    ),
    []
  )
  return (
    <Sheet sheetRef={commentsSheetRef} backdropOpacity={0.9}>
      <View
        style={{
          flex: 1,
          height: height / 2,
          paddingHorizontal: 20,
          paddingBottom: 20
        }}
      >
        <Text style={style.title}>Comments</Text>

        <FlashList
          data={comments ?? []}
          estimatedItemSize={Boolean(comments?.length) ? comments.length : 5}
          ListFooterComponent={() =>
            loading && <ActivityIndicator style={{ paddingVertical: 20 }} />
          }
          ListEmptyComponent={() => !loading && <NotFound />}
          keyExtractor={(item, i) => `${item.id}_${i}`}
          onEndReachedThreshold={0.8}
          onEndReached={pageInfo?.next ? fetchMoreComments : null}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          onRefresh={() => refetch()}
          refreshing={Boolean(comments?.length) && loading}
        />
      </View>
    </Sheet>
  )
}

export default CommentsSheet
