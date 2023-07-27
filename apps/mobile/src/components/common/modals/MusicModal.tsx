import { BlurView } from 'expo-blur'
import React from 'react'

import Stage from '~/components/explore/music/Stage'
import { theme } from '~/helpers/theme'
import { usePlatform } from '~/hooks'

export const MusicModal = (): JSX.Element => {
  const { isAndroid } = usePlatform()

  return (
    <BlurView
      intensity={100}
      tint="dark"
      style={{
        flex: 1,
        backgroundColor: isAndroid ? theme.colors.black : '#00000080'
      }}
    >
      <Stage />
    </BlurView>
  )
}
