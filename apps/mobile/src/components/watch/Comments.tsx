import type { BottomSheetModal } from '@gorhom/bottom-sheet'
import { LENS_CUSTOM_FILTERS } from '@lenstube/constants'
import type { Publication, PublicationsQueryRequest } from '@lenstube/lens'
import { useCommentsQuery } from '@lenstube/lens'
import type { MobileThemeConfig } from '@lenstube/lens/custom-types'
import { Skeleton } from 'moti/skeleton'
import type { FC } from 'react'
import React, { useRef } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'

import { useMobileTheme } from '~/hooks'

import CommentsSheet from '../sheets/CommentsSheet'
import Comment from './Comment'
import CommentButton from './CommentButton'

// fixed height to fix CLS between comment and comment button
const CONTAINER_HEIGHT = 80

const styles = (themeConfig: MobileThemeConfig) =>
  StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'column',
      borderRadius: 15,
      borderColor: themeConfig.borderColor,
      borderWidth: 0.5,
      gap: 10,
      height: CONTAINER_HEIGHT,
      width: '100%'
    }
  })

type Props = {
  id: string
}

const Comments: FC<Props> = ({ id }) => {
  const { themeConfig } = useMobileTheme()
  const style = styles(themeConfig)

  const commentsSheetRef = useRef<BottomSheetModal>(null)

  const request: PublicationsQueryRequest = {
    limit: 1,
    customFilters: LENS_CUSTOM_FILTERS,
    commentsOf: id
  }

  const { data, loading } = useCommentsQuery({
    variables: { request },
    skip: !id
  })
  const comments = data?.publications?.items as Publication[]

  return (
    <>
      <View style={style.container}>
        <Skeleton
          show={loading}
          colors={[`${themeConfig.backgroudColor}50`, 'transparent']}
          radius={15}
          height={CONTAINER_HEIGHT}
        >
          <Pressable
            style={{
              flex: 1,
              justifyContent: 'center',
              paddingHorizontal: 15
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
      <CommentsSheet id={id} commentsSheetRef={commentsSheetRef} />
    </>
  )
}

export default Comments
