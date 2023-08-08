import type { FC } from 'react'
import React from 'react'
import type { TextInputProps } from 'react-native'
import { StyleSheet, TextInput, View } from 'react-native'

import normalizeFont from '~/helpers/normalize-font'
import { theme } from '~/helpers/theme'

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20
  },
  input: {
    fontSize: normalizeFont(15),
    paddingHorizontal: 12,
    color: theme.colors.white,
    fontFamily: 'font-medium'
  }
})

const Input: FC<TextInputProps> = ({ ...props }) => {
  return (
    <View style={styles.container}>
      <TextInput
        {...props}
        style={[styles.input, props.style]}
        placeholderTextColor={theme.colors.grey}
      />
    </View>
  )
}

export default Input
