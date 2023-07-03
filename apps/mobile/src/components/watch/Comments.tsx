import { LENS_CUSTOM_FILTERS } from '@lenstube/constants'
import { getProfilePicture, trimLensHandle } from '@lenstube/generic'
import { type Publication, useCommentsQuery } from '@lenstube/lens'
import { Image as ExpoImage } from 'expo-image'
import type { FC } from 'react'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import normalizeFont from '~/helpers/normalize-font'
import { theme } from '~/helpers/theme'

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    margin: 5,
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
      }, 10000) // 10 secs
    }
    return () => clearInterval(timer)
  }, [currentCommentIndex, comments?.length])

  if (!comments?.length || error) {
    return null
  }

  const comment = comments[currentCommentIndex]

  return (
    <View style={styles.container}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: 5
        }}
      >
        <ExpoImage
          source={getProfilePicture(comment.profile)}
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
    </View>
  )
}

export default Comments
