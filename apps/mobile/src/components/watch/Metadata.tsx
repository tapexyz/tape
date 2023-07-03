import {
  getProfilePicture,
  getRelativeTime,
  trimLensHandle
} from '@lenstube/generic'
import type { Publication } from '@lenstube/lens'
import { Image as ExpoImage } from 'expo-image'
import type { FC } from 'react'
import React, { useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import normalizeFont from '~/helpers/normalize-font'
import { theme } from '~/helpers/theme'

const styles = StyleSheet.create({
  title: {
    color: theme.colors.primary,
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
    color: theme.colors.primary
  }
})

type Props = {
  video: Publication
}

const Metadata: FC<Props> = ({ video }) => {
  const [showMore, setShowMore] = useState(false)

  return (
    <View style={{ paddingVertical: 15, paddingHorizontal: 5 }}>
      <Text style={styles.title}>{video.metadata.name}</Text>
      {video.metadata.description && (
        <Pressable onPress={() => setShowMore(!showMore)}>
          <Text
            numberOfLines={!showMore ? 2 : undefined}
            style={styles.description}
          >
            {video.metadata.description.replace('\n', '')}
          </Text>
        </Pressable>
      )}
      <View style={styles.otherInfoContainer}>
        <ExpoImage
          source={getProfilePicture(video.profile)}
          contentFit="cover"
          style={{ width: 15, height: 15, borderRadius: 3 }}
        />
        <Text style={styles.otherInfo}>
          {trimLensHandle(video.profile.handle)}
        </Text>
        <Text style={{ color: theme.colors.secondary, fontSize: 3 }}>
          {'\u2B24'}
        </Text>
        <Text style={styles.otherInfo}>{video.stats.totalUpvotes} likes</Text>
        <Text style={{ color: theme.colors.secondary, fontSize: 3 }}>
          {'\u2B24'}
        </Text>
        <Text style={styles.otherInfo}>{getRelativeTime(video.createdAt)}</Text>
      </View>
    </View>
  )
}

export default Metadata
