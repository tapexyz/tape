import React from 'react'
import { View } from 'react-native'

import { useMobileTheme } from '~/hooks'

const Separator = () => {
  const { themeConfig } = useMobileTheme()

  return (
    <View
      style={{
        backgroundColor: themeConfig.backgroudColor3,
        height: 0.3,
        borderRadius: 10
      }}
    />
  )
}

export default Separator
