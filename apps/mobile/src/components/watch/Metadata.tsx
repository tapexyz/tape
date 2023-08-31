import { getRelativeTime, trimNewLines } from '@lenstube/generic'
import type { Publication } from '@lenstube/lens'
import type { MobileThemeConfig } from '@lenstube/lens/custom-types'
import type { FC } from 'react'
import React, { useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import normalizeFont from '~/helpers/normalize-font'
import { useMobileTheme } from '~/hooks'

import RenderMarkdown from '../common/markdown/RenderMarkdown'
import UserProfile from '../common/UserProfile'

const styles = (themeConfig: MobileThemeConfig) =>
  StyleSheet.create({
    title: {
      color: themeConfig.textColor,
      fontFamily: 'font-bold',
      fontSize: normalizeFont(13),
      letterSpacing: 0.5
    },
    description: {
      fontFamily: 'font-normal',
      fontSize: normalizeFont(12),
      color: themeConfig.secondaryTextColor,
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
      color: themeConfig.textColor
    }
  })

type Props = {
  video: Publication
}

const Metadata: FC<Props> = ({ video }) => {
  const { themeConfig } = useMobileTheme()
  const style = styles(themeConfig)

  const [showMore, setShowMore] = useState(false)

  return (
    <View style={{ paddingVertical: 15 }}>
      <Text style={style.title}>{video.metadata.name}</Text>
      {video.metadata.description && (
        <Pressable onPress={() => setShowMore(!showMore)}>
          <Text
            numberOfLines={!showMore ? 2 : undefined}
            style={style.description}
          >
            {showMore ? (
              <RenderMarkdown
                content={video.metadata.description}
                textStyle={style.description}
              />
            ) : (
              trimNewLines(video.metadata.description)
            )}
          </Text>
        </Pressable>
      )}
      <View style={style.otherInfoContainer}>
        <UserProfile profile={video.profile} size={15} radius={3} />
        <Text style={{ color: themeConfig.secondaryTextColor, fontSize: 3 }}>
          {'\u2B24'}
        </Text>
        <Text style={style.otherInfo}>{video.stats.totalUpvotes} likes</Text>
        <Text style={{ color: themeConfig.secondaryTextColor, fontSize: 3 }}>
          {'\u2B24'}
        </Text>
        <Text style={style.otherInfo}>{getRelativeTime(video.createdAt)}</Text>
      </View>
    </View>
  )
}

export default Metadata
