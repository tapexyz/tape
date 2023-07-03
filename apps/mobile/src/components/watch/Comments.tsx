import { LENS_CUSTOM_FILTERS } from '@lenstube/constants'
import { getProfilePicture, trimLensHandle } from '@lenstube/generic'
import { type Publication, useCommentsQuery } from '@lenstube/lens'
import { Image as ExpoImage } from 'expo-image'
import type { FC } from 'react'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

import normalizeFont from '~/helpers/normalize-font'
import { theme } from '~/helpers/theme'

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    margin: 5,
    borderRadius: 15,
    padding: 12,
    backgroundColor: theme.colors.backdrop,
    gap: 10
  },
  handle: {
    fontFamily: 'font-medium',
    fontSize: normalizeFont(11),
    color: theme.colors.white,
    letterSpacing: 1
  },
  comment: {
    fontFamily: 'font-normal',
    fontSize: normalizeFont(12),
    color: theme.colors.primary
  }
})

type Props = {
  video: Publication
}

const Comments: FC<Props> = ({ video }) => {
  const request = {
    limit: 1,
    customFilters: LENS_CUSTOM_FILTERS,
    commentsOf: video.id
  }

  const { data, error } = useCommentsQuery({
    variables: { request },
    skip: !video.id
  })
  const comment = data?.publications?.items?.[0] as Publication

  if (!comment || error) {
    return null
  }

  return (
    <View style={styles.container}>
      <ExpoImage
        source={getProfilePicture(video.profile)}
        contentFit="cover"
        style={{ width: 40, height: 40, borderRadius: 10 }}
      />
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}
      >
        <Text style={styles.handle}>
          {trimLensHandle(comment.profile.handle)}
        </Text>
        <Text numberOfLines={1} style={styles.comment}>
          {comment.metadata.content}
        </Text>
      </View>
    </View>
  )
}

export default Comments
