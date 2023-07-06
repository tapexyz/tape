import type { BottomSheetModal } from '@gorhom/bottom-sheet'
import { LENS_CUSTOM_FILTERS } from '@lenstube/constants'
import { type Publication, useCommentsQuery } from '@lenstube/lens'
import { FlashList } from '@shopify/flash-list'
import { Skeleton } from 'moti/skeleton'
import type { FC } from 'react'
import React, { useCallback, useRef } from 'react'
import {
  ActivityIndicator,
  Dimensions,
  Pressable,
  StyleSheet,
  View
} from 'react-native'

import { theme } from '~/helpers/theme'

import Sheet from '../ui/Sheet'
import Comment from './Comment'
import CommentButton from './CommentButton'

// fixed height to fix CLS between comment and comment button
const CONTAINER_HEIGHT = 80

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    marginVertical: 15,
    marginHorizontal: 5,
    borderRadius: 15,
    backgroundColor: theme.colors.backdrop,
    gap: 10,
    height: CONTAINER_HEIGHT
  }
})

type Props = {
  videoId: string
}

const Comments: FC<Props> = ({ videoId }) => {
  const commentsSheetRef = useRef<BottomSheetModal>(null)

  const request = {
    limit: 10,
    customFilters: LENS_CUSTOM_FILTERS,
    commentsOf: videoId
  }

  const { data, fetchMore, loading } = useCommentsQuery({
    variables: { request },
    skip: !videoId
  })
  const comments = data?.publications?.items as Publication[]
  const pageInfo = data?.publications?.pageInfo

  const fetchMoreVideos = async () => {
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
    ({ item }: { item: Publication }) => <Comment comment={item} />,
    []
  )

  return (
    <>
      <View style={styles.container}>
        <Skeleton
          show={loading}
          colors={[theme.colors.backdrop, theme.colors.grey]}
          radius={15}
          height={CONTAINER_HEIGHT}
        >
          <Pressable
            style={{
              flex: 1,
              justifyContent: 'center',
              padding: 15
            }}
            onPress={() => commentsSheetRef.current?.present()}
          >
            {comments?.length ? (
              <Comment comment={comments[0]} />
            ) : (
              <CommentButton />
            )}
          </Pressable>
        </Skeleton>
      </View>

      <Sheet sheetRef={commentsSheetRef} snap={['60%', '90%']} marginX={0}>
        <View
          style={{
            flex: 1,
            padding: 20,
            minHeight: Dimensions.get('screen').height / 2
          }}
        >
          <FlashList
            estimatedItemSize={50}
            data={comments}
            onEndReachedThreshold={0.2}
            ListFooterComponent={() => (
              <ActivityIndicator style={{ paddingVertical: 20 }} />
            )}
            keyExtractor={(item, i) => `${item.id}_${i}`}
            ItemSeparatorComponent={() => <View style={{ height: 30 }} />}
            onEndReached={() => fetchMoreVideos()}
            renderItem={renderItem}
          />
        </View>
      </Sheet>
    </>
  )
}

export default Comments
