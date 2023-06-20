import 'react-native-reanimated'
// eslint-disable-next-line import/no-duplicates
import 'react-native-gesture-handler'

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import React from 'react'
import { StyleSheet } from 'react-native'
// eslint-disable-next-line import/no-duplicates
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import { AppLoading } from './components'
import { Navigation } from './navigation'
import { NotificationsProvider } from './providers'

const styles = StyleSheet.create({
  gestureHandlerRootView: {
    flex: 1
  }
})

const App = (): JSX.Element => {
  return (
    <>
      <NotificationsProvider />
      <AppLoading>
        <GestureHandlerRootView style={styles.gestureHandlerRootView}>
          <BottomSheetModalProvider>
            <Navigation />
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </AppLoading>
    </>
  )
}

export default App
