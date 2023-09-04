import Ionicons from '@expo/vector-icons/Ionicons'
import { getShortHandTime, trimify } from '@lenstube/generic'
import type { Publication } from '@lenstube/lens'
import type { MobileThemeConfig } from '@lenstube/lens/custom-types'
import React from 'react'
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native'

import normalizeFont from '~/helpers/normalize-font'
import { useMobileTheme } from '~/hooks'

import RenderMarkdown from '../common/markdown/RenderMarkdown'
import UserProfile from '../common/UserProfile'

const styles = (themeConfig: MobileThemeConfig) =>
  StyleSheet.create({
    handle: {
      fontFamily: 'font-medium',
      fontSize: normalizeFont(10),
      color: themeConfig.textColor
    },
    comment: {
      fontFamily: 'font-normal',
      fontSize: normalizeFont(12),
      color: themeConfig.textColor,
      lineHeight: 20,
      letterSpacing: 0.5,
      paddingTop: 10
    },
    timestamp: {
      fontFamily: 'font-normal',
      fontSize: normalizeFont(8),
      color: themeConfig.textColor
    }
  })

const Comment = ({
  comment,
  numberOfLines,
  richText = false
}: {
  comment: Publication
  numberOfLines?: number
  richText?: boolean
}) => {
  const { width } = useWindowDimensions()
  const { themeConfig } = useMobileTheme()
  const style = styles(themeConfig)

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
      }}
    >
      <View
        style={{
          width: width * 0.8
        }}
      >
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 5
          }}
        >
          <UserProfile profile={comment.profile} size={15} radius={3} />
          <Text style={{ color: themeConfig.secondaryTextColor, fontSize: 3 }}>
            {'\u2B24'}
          </Text>
          <Text style={style.timestamp}>
            {getShortHandTime(comment.createdAt)}
          </Text>
        </View>
        {richText ? (
          <RenderMarkdown
            content={comment.metadata.content ?? ''}
            textStyle={style.comment}
          />
        ) : (
          <Text numberOfLines={numberOfLines} style={style.comment}>
            {trimify(comment.metadata.content)}
          </Text>
        )}
      </View>
      <View>
        <Ionicons
          name="heart-outline"
          color={themeConfig.textColor}
          size={20}
        />
      </View>
    </View>
  )
}

export default Comment
