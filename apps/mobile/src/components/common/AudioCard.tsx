import {
  getProfilePicture,
  getRelativeTime,
  getThumbnailUrl,
  getValueFromTraitType,
  imageCdn,
  trimify,
  trimLensHandle
} from '@lenstube/generic'
import type { Attribute, Publication } from '@lenstube/lens'
import { useNavigation } from '@react-navigation/native'
import { Image as ExpoImage } from 'expo-image'
import type { FC } from 'react'
import React, { memo } from 'react'
import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View
} from 'react-native'
import { SharedElement } from 'react-navigation-shared-element'

import normalizeFont from '~/helpers/normalize-font'
import { theme } from '~/helpers/theme'

import WaveForm from './WaveForm'

type Props = {
  audio: Publication
}

const styles = StyleSheet.create({
  title: {
    color: theme.colors.white,
    fontFamily: 'font-bold',
    fontSize: normalizeFont(13),
    letterSpacing: 0.5
  },
  description: {
    fontFamily: 'font-normal',
    fontSize: normalizeFont(12),
    color: theme.colors.secondary
  },
  thumbnail: {
    borderRadius: 10,
    backgroundColor: theme.colors.backdrop,
    borderColor: theme.colors.grey,
    borderWidth: 0.5
  },
  otherInfoContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    opacity: 0.8,
    paddingTop: 10
  },
  otherInfo: {
    fontFamily: 'font-normal',
    fontSize: normalizeFont(10),
    color: theme.colors.white
  },
  author: {
    fontFamily: 'font-normal',
    fontSize: normalizeFont(12),
    color: theme.colors.blueGrey,
    letterSpacing: 0.5
  },
  audioInfoContainer: {
    display: 'flex',
    flexDirection: 'column',
    paddingHorizontal: 15,
    justifyContent: 'space-between',
    width: '100%',
    flex: 1
  }
})

const AudioCard: FC<Props> = ({ audio }) => {
  const thumbnailUrl = imageCdn(getThumbnailUrl(audio, true), 'AVATAR_LG')
  const { navigate } = useNavigation()
  const { width } = useWindowDimensions()

  return (
    <Pressable onPress={() => navigate('WatchVideo', { id: audio.id })}>
      <>
        <View style={{ display: 'flex', flexDirection: 'row' }}>
          <SharedElement id={`video.watch.${audio.id}.thumbnail`}>
            <ExpoImage
              source={{ uri: thumbnailUrl }}
              contentFit="cover"
              style={[
                styles.thumbnail,
                { width: width / 3, height: width / 3 }
              ]}
            />
          </SharedElement>
          <View style={styles.audioInfoContainer}>
            <View style={{ gap: 5 }}>
              <Text style={styles.title} numberOfLines={2}>
                {trimify(audio.metadata.name ?? '')}
              </Text>
              <Text style={styles.author}>
                {getValueFromTraitType(
                  audio.metadata.attributes as Attribute[],
                  'author'
                )}
              </Text>
            </View>
            <WaveForm />
          </View>
        </View>
        <View style={{ paddingVertical: 10, paddingHorizontal: 5 }}>
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
            <Text style={styles.otherInfo}>
              {audio.stats.totalUpvotes} likes
            </Text>
            <Text style={{ color: theme.colors.secondary, fontSize: 3 }}>
              {'\u2B24'}
            </Text>
            <Text style={styles.otherInfo}>
              {getRelativeTime(audio.createdAt)}
            </Text>
          </View>
        </View>
      </>
    </Pressable>
  )
}

export default memo(AudioCard)
