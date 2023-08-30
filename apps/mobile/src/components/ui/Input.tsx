import type { MobileThemeConfig } from '@lenstube/lens/custom-types'
import type { FC } from 'react'
import React from 'react'
import type { TextInputProps } from 'react-native'
import { StyleSheet, TextInput, View } from 'react-native'

import normalizeFont from '~/helpers/normalize-font'
import { colors } from '~/helpers/theme'
import { useMobileTheme } from '~/hooks'

interface Props extends TextInputProps {
  errored?: boolean
}

const styles = (themeConfig: MobileThemeConfig) =>
  StyleSheet.create({
    container: {
      paddingVertical: 20
    },
    input: {
      fontSize: normalizeFont(15),
      color: themeConfig.textColor,
      fontFamily: 'font-medium'
    }
  })

const Input: FC<Props> = ({ ...props }) => {
  const { themeConfig } = useMobileTheme()
  const style = styles(themeConfig)

  return (
    <View style={style.container}>
      <TextInput
        {...props}
        style={[style.input, props.style]}
        placeholderTextColor={props.errored ? colors.red : colors.grey}
      />
    </View>
  )
}

export default Input
