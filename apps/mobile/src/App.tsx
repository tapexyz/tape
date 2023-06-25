import 'react-native-reanimated'
// eslint-disable-next-line import/no-duplicates
import 'react-native-gesture-handler'

import { ApolloProvider } from '@apollo/client'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { LIVEPEER_STUDIO_API_KEY } from '@lenstube/constants'
import apolloClient from '@lenstube/lens/apollo'
import {
  createReactClient,
  LivepeerConfig,
  studioProvider
} from '@livepeer/react-native'
import React from 'react'
import { StyleSheet } from 'react-native'
// eslint-disable-next-line import/no-duplicates
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import { AppLoading } from './components'
import mobileAuthLink from './helpers/auth-link'
import { Navigation } from './navigation'
import { NotificationsProvider } from './providers'

const styles = StyleSheet.create({
  gestureHandlerRootView: {
    flex: 1
  }
})

const livepeerClient = createReactClient({
  provider: studioProvider({ apiKey: LIVEPEER_STUDIO_API_KEY })
})

const App = (): JSX.Element => {
  return (
    <ApolloProvider client={apolloClient(mobileAuthLink)}>
      <LivepeerConfig client={livepeerClient}>
        <NotificationsProvider />
        <AppLoading>
          <GestureHandlerRootView style={styles.gestureHandlerRootView}>
            <BottomSheetModalProvider>
              <Navigation />
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
        </AppLoading>
      </LivepeerConfig>
    </ApolloProvider>
  )
}

export default App
