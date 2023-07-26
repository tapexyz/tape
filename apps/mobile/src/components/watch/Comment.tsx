import Ionicons from '@expo/vector-icons/Ionicons'
import {
  getProfilePicture,
  getShortHandTime,
  imageCdn,
  trimify,
  trimLensHandle
} from '@lenstube/generic'
import type { Publication } from '@lenstube/lens'
import { Image as ExpoImage } from 'expo-image'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

import normalizeFont from '~/helpers/normalize-font'
import { theme } from '~/helpers/theme'

const styles = StyleSheet.create({
  handle: {
    fontFamily: 'font-medium',
    fontSize: normalizeFont(10),
    color: theme.colors.white
  },
  comment: {
    fontFamily: 'font-normal',
    fontSize: normalizeFont(12),
    color: theme.colors.white,
    lineHeight: 20
  },
  timestamp: {
    fontFamily: 'font-normal',
    fontSize: normalizeFont(8),
    color: theme.colors.white
  }
})

const Comment = ({ comment }: { comment: Publication }) => {
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
      }}
    >
      <View style={{ gap: 10 }}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 5
          }}
        >
          <ExpoImage
            source={{
              uri: imageCdn(getProfilePicture(comment.profile), 'AVATAR')
            }}
            contentFit="cover"
            style={{ width: 15, height: 15, borderRadius: 3 }}
          />
          <Text style={styles.handle}>
            {trimLensHandle(comment.profile.handle)}
          </Text>
          <Text style={{ color: theme.colors.secondary, fontSize: 3 }}>
            {'\u2B24'}
          </Text>
          <Text style={styles.timestamp}>
            {getShortHandTime(comment.createdAt)}
          </Text>
        </View>
        <Text style={styles.comment}>{trimify(comment.metadata.content)}</Text>
      </View>
      <View>
        <Ionicons name="heart-outline" color={theme.colors.white} size={20} />
      </View>
    </View>
  )
}

export default Comment
