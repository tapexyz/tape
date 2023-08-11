import { getRelativeTime, trimNewLines } from '@lenstube/generic'
import type { Publication } from '@lenstube/lens'
import type { FC } from 'react'
import React, { memo } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import normalizeFont from '~/helpers/normalize-font'
import { theme } from '~/helpers/theme'

import ImageSlider from '../ui/ImageSlider'
import UserProfile from './UserProfile'

type Props = {
  image: Publication
}

const BORDER_RADIUS = 10

const styles = StyleSheet.create({
  title: {
    color: theme.colors.white,
    fontFamily: 'font-bold',
    fontSize: normalizeFont(13),
    letterSpacing: 0.5
  },
  content: {
    fontFamily: 'font-normal',
    fontSize: normalizeFont(12),
    color: theme.colors.secondary,
    paddingTop: 10
  },
  thumbnail: {
    width: '100%',
    height: 215,
    borderRadius: BORDER_RADIUS,
    borderColor: theme.colors.grey,
    borderWidth: 0.5
  },
  otherInfoContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 10,
    opacity: 0.8
  },
  otherInfo: {
    fontFamily: 'font-normal',
    fontSize: normalizeFont(10),
    color: theme.colors.white
  }
})

const ImageCard: FC<Props> = ({ image }) => {
  return (
    <Pressable>
      <ImageSlider images={image.metadata?.media} />

      <View style={{ paddingVertical: 15, paddingHorizontal: 5 }}>
        {image.metadata?.content && (
          <Text style={styles.content} numberOfLines={3}>
            {trimNewLines(image.metadata.content)}
          </Text>
        )}
        <View style={styles.otherInfoContainer}>
          <UserProfile profile={image.profile} size={15} radius={3} />
          <Text style={{ color: theme.colors.secondary, fontSize: 3 }}>
            {'\u2B24'}
          </Text>
          <Text style={styles.otherInfo}>{image.stats.totalUpvotes} likes</Text>
          <Text style={{ color: theme.colors.secondary, fontSize: 3 }}>
            {'\u2B24'}
          </Text>
          <Text style={styles.otherInfo}>
            {getRelativeTime(image.createdAt)}
          </Text>
        </View>
      </View>
    </Pressable>
  )
}

export default memo(ImageCard)
