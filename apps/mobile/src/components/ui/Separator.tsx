import React from 'react'
import { View } from 'react-native'

import { theme } from '~/helpers/theme'

const Separator = () => {
  return (
    <View
      style={{
        backgroundColor: theme.colors.backdrop2,
        height: 0.3,
        borderRadius: 10
      }}
    />
  )
}

export default Separator
