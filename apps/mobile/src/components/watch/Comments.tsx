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
    borderRadius: 15,
    backgroundColor: theme.colors.backdrop,
    gap: 10,
    height: CONTAINER_HEIGHT,
    width: '100%'
  }
})

type Props = {
  id: string
}

const Comments: FC<Props> = ({ id }) => {
  const commentsSheetRef = useRef<BottomSheetModal>(null)

  const request = {
    limit: 10,
    customFilters: LENS_CUSTOM_FILTERS,
    commentsOf: id
  }

  const { data, fetchMore, loading } = useCommentsQuery({
    variables: { request },
    skip: !id
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
              justifyContent: 'center'
            }}
            onPress={() => commentsSheetRef.current?.present()}
          >
            {comments?.length ? (
              <Comment comment={comments[0]} numberOfLines={1} />
            ) : (
              <CommentButton />
            )}
          </Pressable>
        </Skeleton>
      </View>

      <Sheet sheetRef={commentsSheetRef} snap={['70%']} marginX={0}>
        <View
          style={{
            flex: 1,
            height: Dimensions.get('screen').height / 2
          }}
        >
          {comments?.length ? (
            <FlashList
              data={comments}
              estimatedItemSize={comments?.length ?? 0}
              ListFooterComponent={() =>
                loading && <ActivityIndicator style={{ paddingVertical: 20 }} />
              }
              keyExtractor={(item, i) => `${item.id}_${i}`}
              onEndReachedThreshold={0.8}
              onEndReached={() => fetchMoreVideos()}
              showsVerticalScrollIndicator={false}
              renderItem={renderItem}
            />
          ) : null}
        </View>
      </Sheet>
    </>
  )
}

export default Comments
