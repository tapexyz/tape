import {
  getShortHandTime,
  getThumbnailUrl,
  imageCdn,
  trimify
} from '@lenstube/generic'
import type { Publication } from '@lenstube/lens'
import { Image as ExpoImage } from 'expo-image'
import type { FC } from 'react'
import React from 'react'
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import { SharedElement } from 'react-navigation-shared-element'

import UserProfile from '~/components/common/UserProfile'
import normalizeFont from '~/helpers/normalize-font'
import { theme } from '~/helpers/theme'

const BORDER_RADIUS = 25

const styles = StyleSheet.create({
  poster: {
    borderRadius: BORDER_RADIUS,
    aspectRatio: 1 / 1,
    borderColor: theme.colors.grey,
    borderWidth: 0.5
  },
  title: {
    color: theme.colors.white,
    fontFamily: 'font-bold',
    fontSize: normalizeFont(14),
    letterSpacing: 0.5,
    textAlign: 'center'
  },
  description: {
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
  },
  icon: {
    backgroundColor: theme.colors.grey,
    borderRadius: 100,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50
  }
})

type Props = {
  audio: Publication
}

const Item: FC<Props> = ({ audio }) => {
  const { width } = useWindowDimensions()

  return (
    <View style={{ width }}>
      <View
        style={{
          paddingHorizontal: 15,
          alignItems: 'center'
        }}
      >
        <Text numberOfLines={1} style={styles.title}>
          {trimify(audio.metadata.name ?? '')}
        </Text>
        <View style={styles.otherInfoContainer}>
          <UserProfile profile={audio.profile} size={15} radius={3} />
          <Text style={{ color: theme.colors.secondary, fontSize: 3 }}>
            {'\u2B24'}
          </Text>
          <Text style={styles.otherInfo}>{audio.stats.totalUpvotes} likes</Text>
          <Text style={{ color: theme.colors.secondary, fontSize: 3 }}>
            {'\u2B24'}
          </Text>
          <Text style={styles.otherInfo}>
            {getShortHandTime(audio.createdAt)}
          </Text>
        </View>
      </View>
      <View
        style={{
          paddingTop: 20,
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <SharedElement
          id={`item.${audio.id}.image`}
          style={[styles.poster, { height: width * 0.6 }]}
        >
          <ExpoImage
            source={{
              uri: imageCdn(getThumbnailUrl(audio), 'SQUARE')
            }}
            transition={300}
            contentFit="cover"
            style={[styles.poster, { height: width * 0.6 }]}
          />
        </SharedElement>
      </View>
    </View>
  )
}

export default Item
