import type { BottomSheetModal } from '@gorhom/bottom-sheet'
import { LENS_CUSTOM_FILTERS } from '@lenstube/constants'
import { getProfilePicture, imageCdn, trimLensHandle } from '@lenstube/generic'
import { type Publication, useCommentsQuery } from '@lenstube/lens'
import { FlashList } from '@shopify/flash-list'
import { Image as ExpoImage } from 'expo-image'
import type { FC } from 'react'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native'

import normalizeFont from '~/helpers/normalize-font'
import { theme } from '~/helpers/theme'

import AnimatedPressable from '../ui/AnimatedPressable'
import Sheet from '../ui/Sheet'

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    marginVertical: 15,
    marginHorizontal: 5,
    borderRadius: 15,
    padding: 15,
    backgroundColor: theme.colors.backdrop,
    gap: 10
  },
  handle: {
    fontFamily: 'font-normal',
    fontSize: normalizeFont(10),
    color: theme.colors.primary,
    letterSpacing: 1
  },
  comment: {
    fontFamily: 'font-normal',
    fontSize: normalizeFont(12),
    color: theme.colors.white,
    lineHeight: 20
  }
})

type Props = {
  video: Publication
}

const Comments: FC<Props> = ({ video }) => {
  const commentsSheetRef = useRef<BottomSheetModal>(null)
  const snapPoints = useMemo(() => ['70%'], [])

  const [currentCommentIndex, setCurrentCommentIndex] = useState(0)

  const request = {
    limit: 10,
    customFilters: LENS_CUSTOM_FILTERS,
    commentsOf: video.id
  }

  const { data, error } = useCommentsQuery({
    variables: { request },
    skip: !video.id
  })
  const comments = data?.publications?.items as Publication[]

  useEffect(() => {
    let timer: NodeJS.Timer
    if (comments?.length) {
      timer = setInterval(() => {
        setCurrentCommentIndex(
          currentCommentIndex === comments.length - 1
            ? 0
            : currentCommentIndex + 1
        )
      }, 20000) // 20 secs
    }
    return () => clearInterval(timer)
  }, [currentCommentIndex, comments?.length])

  if (!comments?.length || error) {
    return null
  }

  const comment = comments[currentCommentIndex]

  return (
    <>
      <AnimatedPressable
        style={styles.container}
        onPress={() => commentsSheetRef.current?.present()}
      >
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 5
          }}
        >
          <ExpoImage
            source={imageCdn(getProfilePicture(comment.profile), 'AVATAR')}
            contentFit="cover"
            style={{ width: 15, height: 15, borderRadius: 3 }}
          />
          <Text style={styles.handle}>
            {trimLensHandle(comment.profile.handle)}
          </Text>
        </View>
        <Text numberOfLines={1} style={styles.comment}>
          {comment.metadata.content}
        </Text>
      </AnimatedPressable>

      <Sheet sheetRef={commentsSheetRef} snap={snapPoints}>
        <ScrollView
          style={{
            flex: 1
          }}
        >
          <View
            style={{
              paddingVertical: 15,
              paddingHorizontal: 20,
              minHeight: Dimensions.get('screen').height / 2
            }}
          >
            <FlashList
              ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
              renderItem={({ item }) => {
                return (
                  <View style={{ gap: 10 }}>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 5
                      }}
                    >
                      <ExpoImage
                        source={imageCdn(
                          getProfilePicture(item.profile),
                          'AVATAR'
                        )}
                        contentFit="cover"
                        style={{ width: 15, height: 15, borderRadius: 3 }}
                      />
                      <Text style={styles.handle}>
                        {trimLensHandle(item.profile.handle)}
                      </Text>
                    </View>
                    <Text style={styles.comment}>{item.metadata.content}</Text>
                  </View>
                )
              }}
              estimatedItemSize={50}
              data={comments}
            />
          </View>
        </ScrollView>
      </Sheet>
    </>
  )
}

export default Comments
