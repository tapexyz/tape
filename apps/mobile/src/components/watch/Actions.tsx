import Ionicons from '@expo/vector-icons/Ionicons'
import { getSharableLink, trimify } from '@lenstube/generic'
import type { Publication } from '@lenstube/lens'
import type { MobileThemeConfig } from '@lenstube/lens/custom-types'
import type { FC } from 'react'
import React from 'react'
import { ScrollView, Share, StyleSheet, Text } from 'react-native'

import haptic from '~/helpers/haptic'
import normalizeFont from '~/helpers/normalize-font'
import { useMobileTheme } from '~/hooks'

import AnimatedPressable from '../ui/AnimatedPressable'

const styles = (themeConfig: MobileThemeConfig) =>
  StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
      paddingBottom: 15
    },
    otherInfo: {
      fontFamily: 'font-normal',
      fontSize: normalizeFont(10),
      color: themeConfig.textColor,
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
  const { themeConfig } = useMobileTheme()
  const style = styles(themeConfig)

  const title = trimify(video.metadata.name ?? video.metadata.content)
  const handle = video.profile?.handle
  return (
    <ScrollView
      horizontal
      contentContainerStyle={style.container}
      showsHorizontalScrollIndicator={false}
    >
      <AnimatedPressable style={style.action}>
        <Ionicons
          name="heart-outline"
          color={themeConfig.textColor}
          size={25}
        />
        <Text style={style.otherInfo}>Like</Text>
      </AnimatedPressable>
      <AnimatedPressable style={style.action}>
        <Ionicons name="sync-outline" color={themeConfig.textColor} size={25} />
        <Text style={style.otherInfo}>Mirror</Text>
      </AnimatedPressable>
      <AnimatedPressable style={style.action}>
        <Ionicons
          name="layers-outline"
          color={themeConfig.textColor}
          size={25}
        />
        <Text style={style.otherInfo}>Collect</Text>
      </AnimatedPressable>
      <AnimatedPressable style={style.action}>
        <Ionicons
          name="bookmark-outline"
          color={themeConfig.textColor}
          size={25}
        />
        <Text style={style.otherInfo}>Save</Text>
      </AnimatedPressable>
      <AnimatedPressable
        onPress={() => {
          haptic()
          Share.share({
            url: getSharableLink('lenstube', video),
            message: `${title} by @${handle}`,
            title: `${title} by @${handle}`
          })
        }}
        style={style.action}
      >
        <Ionicons
          name="paper-plane-outline"
          color={themeConfig.textColor}
          size={25}
        />
        <Text style={style.otherInfo}>Share</Text>
      </AnimatedPressable>
    </ScrollView>
  )
}

export default Actions
