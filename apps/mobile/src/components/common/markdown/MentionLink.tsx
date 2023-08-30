import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { StyleSheet, Text } from 'react-native'

import AnimatedPressable from '~/components/ui/AnimatedPressable'
import normalizeFont from '~/helpers/normalize-font'
import { colors } from '~/helpers/theme'

export type MentionLinkProps = {
  handle: string
}
const styles = StyleSheet.create({
  mention: {
    fontFamily: 'font-normal',
    fontSize: normalizeFont(13),
    color: colors.yellow,
    letterSpacing: 0.6,
    opacity: 0.9
  }
})

const MentionLink = ({ handle }: MentionLinkProps) => {
  const { navigate } = useNavigation()

  return (
    <AnimatedPressable
      onPress={() => {
        navigate('ProfileScreen', { handle: handle.replace('@', '') })
      }}
    >
      <Text style={styles.mention}>{handle}</Text>
    </AnimatedPressable>
  )
}

export default MentionLink
