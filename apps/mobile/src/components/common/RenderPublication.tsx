import { getRelativeTime, trimNewLines } from '@lenstube/generic'
import { type Publication, PublicationMainFocus } from '@lenstube/lens'
import type { FC } from 'react'
import React, { memo } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import normalizeFont from '~/helpers/normalize-font'
import { theme } from '~/helpers/theme'

import ImageSlider from '../ui/ImageSlider'
import UserProfile from './UserProfile'

type Props = {
  publication: Publication
}

const BORDER_RADIUS = 10

const styles = StyleSheet.create({
  title: {
    color: theme.colors.white,
    fontFamily: 'font-bold',
    fontSize: normalizeFont(13),
    letterSpacing: 0.5
  },
  textContent: {
    fontFamily: 'font-normal',
    fontSize: normalizeFont(13),
    color: theme.colors.white,
    letterSpacing: 0.6,
    opacity: 0.9
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
    opacity: 0.8,
    paddingHorizontal: 5
  },
  otherInfo: {
    fontFamily: 'font-normal',
    fontSize: normalizeFont(10),
    color: theme.colors.white
  }
})

const RenderPublication: FC<Props> = ({ publication }) => {
  const media = publication.metadata?.media
  const isTextPost =
    publication.metadata.mainContentFocus === PublicationMainFocus.TextOnly ||
    publication.metadata.mainContentFocus === PublicationMainFocus.Article ||
    publication.metadata.mainContentFocus === PublicationMainFocus.Link

  return (
    <Pressable style={{ gap: 15 }}>
      {Boolean(media?.length) && <ImageSlider images={media} />}

      <View>
        {publication.metadata?.content && (
          <View
            style={{
              backgroundColor: isTextPost
                ? theme.colors.backdrop2
                : 'transparent',
              padding: isTextPost ? 15 : 0,
              borderRadius: 20,
              borderBottomLeftRadius: 0,
              borderColor: isTextPost ? theme.colors.grey : 'transparent',
              borderWidth: 1
            }}
          >
            {isTextPost ? (
              <Text style={styles.textContent}>
                {publication.metadata.content}
              </Text>
            ) : (
              <Text style={styles.textContent} numberOfLines={3}>
                {trimNewLines(publication.metadata.content)}
                {publication.metadata.mainContentFocus}
              </Text>
            )}
          </View>
        )}
        <View style={styles.otherInfoContainer}>
          <UserProfile profile={publication.profile} size={15} radius={3} />
          <Text
            style={{
              color: theme.colors.secondary,
              fontSize: 3
            }}
          >
            {'\u2B24'}
          </Text>
          <Text style={styles.otherInfo}>
            {publication.stats.totalUpvotes} likes
          </Text>
          <Text style={{ color: theme.colors.secondary, fontSize: 3 }}>
            {'\u2B24'}
          </Text>
          <Text style={styles.otherInfo}>
            {getRelativeTime(publication.createdAt)}
          </Text>
        </View>
      </View>
    </Pressable>
  )
}

export default memo(RenderPublication)
