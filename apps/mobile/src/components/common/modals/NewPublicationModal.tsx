import React from 'react'
import {
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  StyleSheet
} from 'react-native'

import ActionHeader from '~/components/new/ActionHeader'
import Form from '~/components/new/Form'
import normalizeFont from '~/helpers/normalize-font'
import { theme } from '~/helpers/theme'
import { usePlatform } from '~/hooks'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: theme.colors.black
  },
  text: {
    fontFamily: 'font-medium',
    fontSize: normalizeFont(12),
    color: theme.colors.secondary
  }
})

export const NewPublicationModal = () => {
  const { isIOS } = usePlatform()
  return (
    <SafeAreaView style={styles.container}>
      <ActionHeader />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={isIOS ? 'padding' : 'height'}
        keyboardVerticalOffset={isIOS ? 20 : 0} // Adjust this as needed
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ flexGrow: 1 }}
        >
          <Form />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
