import 'react-native-reanimated'
// eslint-disable-next-line import/no-duplicates
import 'react-native-gesture-handler'

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { StatusBar } from 'expo-status-bar'
import { MotiView } from 'moti'
import React, { useReducer } from 'react'
import { Pressable, StyleSheet } from 'react-native'
// eslint-disable-next-line import/no-duplicates
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import { AppLoading } from './components'
import { useNotifications } from './hooks'
import { Navigation } from './navigation'
import { NotificationsProvider } from './providers'

const styles = StyleSheet.create({
  shape: {
    justifyContent: 'center',
    height: 250,
    width: 250,
    borderRadius: 25,
    marginRight: 10,
    backgroundColor: 'white'
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: '#9c1aff'
  },
  gestureHandlerRootView: {
    flex: 1
  }
})

function Shape() {
  return (
    <MotiView
      from={{
        opacity: 0,
        scale: 0.5
      }}
      animate={{
        opacity: 1,
        scale: 1
      }}
      transition={{
        type: 'timing'
      }}
      style={styles.shape}
    />
  )
}

const App = (): JSX.Element => {
  const [visible, toggle] = useReducer((s) => !s, true)
  const { notify } = useNotifications()

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
      <Pressable
        onPress={() => {
          toggle()
          notify('success', {
            params: {
              title: 'Hello',
              description: 'Wow, that was easy',
              hideCloseButton: true
            }
          })
        }}
        style={styles.container}
      >
        <StatusBar style="auto" />
        {visible && <Shape />}
      </Pressable>
    </>
  )
}

export default App
