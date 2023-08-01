import Ionicons from '@expo/vector-icons/Ionicons'
import { getShortHandTime, trimify } from '@lenstube/generic'
import type { Publication } from '@lenstube/lens'
import React from 'react'
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native'

import normalizeFont from '~/helpers/normalize-font'
import { theme } from '~/helpers/theme'

import UserProfile from '../common/UserProfile'

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
    lineHeight: 20,
    letterSpacing: 0.5
  },
  timestamp: {
    fontFamily: 'font-normal',
    fontSize: normalizeFont(8),
    color: theme.colors.white
  }
})

const Comment = ({
  comment,
  numberOfLines
}: {
  comment: Publication
  numberOfLines?: number
}) => {
  const { width } = useWindowDimensions()

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20
      }}
    >
      <View style={{ gap: 10, width: width * 0.8 }}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 5
          }}
        >
          <UserProfile profile={comment.profile} size={15} radius={3} />
          <Text style={{ color: theme.colors.secondary, fontSize: 3 }}>
            {'\u2B24'}
          </Text>
          <Text style={styles.timestamp}>
            {getShortHandTime(comment.createdAt)}
          </Text>
        </View>
        <Text numberOfLines={numberOfLines} style={styles.comment}>
          {trimify(comment.metadata.content)}
        </Text>
      </View>
      <View>
        <Ionicons name="heart-outline" color={theme.colors.white} size={20} />
      </View>
    </View>
  )
}

export default Comment
