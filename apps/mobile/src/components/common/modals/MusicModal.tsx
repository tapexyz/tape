import React from 'react'
import { View } from 'react-native'

import Stage from '~/components/explore/music/Stage'
import { useMobileTheme } from '~/hooks'

export const MusicModal = (): JSX.Element => {
  const { themeConfig } = useMobileTheme()

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: themeConfig.backgroudColor
      }}
    >
      <Stage />
    </View>
  )
}
