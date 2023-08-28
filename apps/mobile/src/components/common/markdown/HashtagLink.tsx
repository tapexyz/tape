import React from 'react'
import { Pressable, StyleSheet, Text } from 'react-native'

import normalizeFont from '~/helpers/normalize-font'
import { theme } from '~/helpers/theme'

export type HashtagLinkProps = {
  hashtag: string
}
const styles = StyleSheet.create({
  hashtag: {
    fontFamily: 'font-normal',
    fontSize: normalizeFont(13),
    color: theme.colors.secondary,
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
