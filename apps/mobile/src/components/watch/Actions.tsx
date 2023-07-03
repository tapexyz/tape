import Ionicons from '@expo/vector-icons/Ionicons'
import { getSharableLink } from '@lenstube/generic'
import type { Publication } from '@lenstube/lens'
import type { FC } from 'react'
import React from 'react'
import { Share, StyleSheet, Text, View } from 'react-native'

import haptic from '~/helpers/haptic'
import normalizeFont from '~/helpers/normalize-font'
import { theme } from '~/helpers/theme'

import AnimatedPressable from '../ui/AnimatedPressable'

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  otherInfo: {
    fontFamily: 'font-normal',
    fontSize: normalizeFont(10),
    color: theme.colors.primary,
    textAlign: 'center'
  },
  action: {
    padding: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 5
  }
})

type Props = {
  video: Publication
}

const Actions: FC<Props> = ({ video }) => {
  const shareContent = `${video.metadata.name ?? video.metadata.content} by @${
    video.profile?.handle
  }`

  return (
    <View style={styles.container}>
      <AnimatedPressable style={styles.action}>
        <Ionicons name="heart-outline" color={theme.colors.white} size={25} />
        <Text style={styles.otherInfo}>Like</Text>
      </AnimatedPressable>
      <AnimatedPressable style={styles.action}>
        <Ionicons name="grid-outline" color={theme.colors.white} size={25} />
        <Text style={styles.otherInfo}>Collect</Text>
      </AnimatedPressable>
      <AnimatedPressable style={styles.action}>
        <Ionicons
          name="bookmark-outline"
          color={theme.colors.white}
          size={25}
        />
        <Text style={styles.otherInfo}>Save</Text>
      </AnimatedPressable>
      <AnimatedPressable
        onPress={() => {
          haptic()
          Share.share({
            url: getSharableLink('lenstube', video),
            message: shareContent,
            title: shareContent
          })
        }}
        style={styles.action}
      >
        <Ionicons
          name="paper-plane-outline"
          color={theme.colors.white}
          size={25}
        />
        <Text style={styles.otherInfo}>Share</Text>
      </AnimatedPressable>
    </View>
  )
}

export default Actions
