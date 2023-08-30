import { getRelativeTime, trimNewLines } from '@lenstube/generic'
import { type Publication, PublicationMainFocus } from '@lenstube/lens'
import type { MobileThemeConfig } from '@lenstube/lens/custom-types'
import type { FC } from 'react'
import React, { memo } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import normalizeFont from '~/helpers/normalize-font'
import { useMobileTheme } from '~/hooks'

import ImageSlider from '../ui/ImageSlider'
import RenderMarkdown from './markdown/RenderMarkdown'
import UserProfile from './UserProfile'

type Props = {
  publication: Publication
}

const BORDER_RADIUS = 10

const styles = (themeConfig: MobileThemeConfig) =>
  StyleSheet.create({
    title: {
      color: themeConfig.textColor,
      fontFamily: 'font-bold',
      fontSize: normalizeFont(13),
      letterSpacing: 0.5
    },
    textContent: {
      fontFamily: 'font-normal',
      fontSize: normalizeFont(13),
      color: themeConfig.textColor,
      letterSpacing: 0.6,
      opacity: 0.9
    },
    thumbnail: {
      width: '100%',
      height: 215,
      borderRadius: BORDER_RADIUS,
      borderColor: themeConfig.borderColor,
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
      color: themeConfig.textColor
    }
  })

const RenderPublication: FC<Props> = ({ publication }) => {
  const { themeConfig } = useMobileTheme()
  const style = styles(themeConfig)

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
                ? themeConfig.backgroudColor2
                : 'transparent',
              paddingHorizontal: isTextPost ? 15 : 0,
              borderRadius: 20,
              borderBottomLeftRadius: 0,
              borderColor: isTextPost ? themeConfig.borderColor : 'transparent',
              borderWidth: 1
            }}
          >
            {isTextPost ? (
              <RenderMarkdown
                content={publication.metadata.content ?? ''}
                textStyle={style.textContent}
              />
            ) : (
              <Text style={style.textContent} numberOfLines={3}>
                {trimNewLines(publication.metadata.content)}
              </Text>
            )}
          </View>
        )}
        <View style={style.otherInfoContainer}>
          <UserProfile profile={publication.profile} size={15} radius={3} />
          <Text
            style={{
              color: themeConfig.secondaryTextColor,
              fontSize: 3
            }}
          >
            {'\u2B24'}
          </Text>
          <Text style={style.otherInfo}>
            {publication.stats.totalUpvotes} likes
          </Text>
          <Text style={{ color: themeConfig.secondaryTextColor, fontSize: 3 }}>
            {'\u2B24'}
          </Text>
          <Text style={style.otherInfo}>
            {getRelativeTime(publication.createdAt)}
          </Text>
        </View>
      </View>
    </Pressable>
  )
}

export default memo(RenderPublication)
