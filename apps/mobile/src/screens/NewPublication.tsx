import React from 'react'
import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  View
} from 'react-native'

import ActionHeader from '~/components/new/ActionHeader'
import Form from '~/components/new/Form'
import normalizeFont from '~/helpers/normalize-font'
import { theme } from '~/helpers/theme'
import { usePlatform, useSafeAreaInsets } from '~/hooks'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 5,
    backgroundColor: theme.colors.black
  },
  text: {
    fontFamily: 'font-medium',
    fontSize: normalizeFont(12),
    color: theme.colors.secondary
  }
})

export const NewPublication = () => {
  const { isIOS } = usePlatform()
  const { top } = useSafeAreaInsets()
  return (
    <View style={[styles.container, { top }]}>
      <ActionHeader />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={isIOS ? 'padding' : 'height'}
        keyboardVerticalOffset={isIOS ? 20 : 0}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ flexGrow: 1 }}
        >
          <Form />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )
}
