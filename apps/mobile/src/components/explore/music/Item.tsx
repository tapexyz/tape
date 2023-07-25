import {
  getProfilePicture,
  getShortHandTime,
  getThumbnailUrl,
  imageCdn,
  trimify,
  trimLensHandle
} from '@lenstube/generic'
import type { Publication } from '@lenstube/lens'
import { Image as ExpoImage } from 'expo-image'
import type { FC } from 'react'
import React from 'react'
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import { SharedElement } from 'react-navigation-shared-element'

import normalizeFont from '~/helpers/normalize-font'
import { theme } from '~/helpers/theme'

const BORDER_RADIUS = 25

const styles = StyleSheet.create({
  poster: {
    width: '100%',
    borderRadius: BORDER_RADIUS,
    backgroundColor: theme.colors.backdrop
  },
  title: {
    color: theme.colors.white,
    fontFamily: 'font-bold',
    fontSize: normalizeFont(13),
    letterSpacing: 0.5
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
          marginHorizontal: 10,
          alignItems: 'center',
          borderRadius: BORDER_RADIUS,
          borderColor: theme.colors.grey,
          borderWidth: 0.5,
          justifyContent: 'center'
        }}
      >
        <SharedElement
          id={`item.${audio.id}.image`}
          style={[styles.poster, { height: width }]}
        >
          <ExpoImage
            source={{
              uri: imageCdn(getThumbnailUrl(audio))
            }}
            contentFit="cover"
            style={[styles.poster, { height: width }]}
          />
        </SharedElement>
      </View>
      <View
        style={{
          paddingHorizontal: 15,
          paddingVertical: 10
        }}
      >
        <Text numberOfLines={2} style={styles.title}>
          {trimify(audio.metadata.name ?? '')}
        </Text>
        {audio.metadata.description && (
          <Text numberOfLines={3} style={styles.description}>
            {audio.metadata.description.replace('\n', '')}
          </Text>
        )}
        <View style={styles.otherInfoContainer}>
          <ExpoImage
            source={{ uri: imageCdn(getProfilePicture(audio.profile)) }}
            contentFit="cover"
            style={{ width: 15, height: 15, borderRadius: 3 }}
          />
          <Text style={styles.otherInfo}>
            {trimLensHandle(audio.profile.handle)}
          </Text>
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
    </View>
  )
}

export default Item
