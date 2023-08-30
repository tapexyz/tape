import type { MobileThemeConfig } from '@lenstube/lens/custom-types'
import React from 'react'
import { Pressable, StyleSheet, Text } from 'react-native'

import normalizeFont from '~/helpers/normalize-font'

export type HashtagLinkProps = {
  hashtag: string
}

const styles = (themeConfig: MobileThemeConfig) =>
  StyleSheet.create({
    hashtag: {
      fontFamily: 'font-normal',
      fontSize: normalizeFont(13),
      color: themeConfig.secondaryTextColor,
      letterSpacing: 0.6
    }
  })

const HashtagLink = ({ hashtag }: HashtagLinkProps) => {
  return (
    <Pressable>
      <Text style={styles.hashtag}>{hashtag}</Text>
    </Pressable>
  )
}

export default HashtagLink
