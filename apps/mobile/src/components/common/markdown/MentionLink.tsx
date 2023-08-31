import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { StyleSheet, Text } from 'react-native'

import normalizeFont from '~/helpers/normalize-font'
import { colors } from '~/helpers/theme'

export type MentionLinkProps = {
  handle: string
}
const styles = StyleSheet.create({
  mention: {
    fontFamily: 'font-normal',
    fontSize: normalizeFont(13),
    color: colors.green
  }
})

const MentionLink = ({ handle }: MentionLinkProps) => {
  const { navigate } = useNavigation()

  return (
    <Text
      suppressHighlighting
      onPress={() => {
        navigate('ProfileScreen', { handle })
      }}
      style={styles.mention}
    >
      {handle}
    </Text>
  )
}

export default MentionLink
