import 'react-native-reanimated'
// eslint-disable-next-line import/no-duplicates
import 'react-native-gesture-handler'

import {
  ApolloClient,
  ApolloProvider,
  from,
  HttpLink,
  InMemoryCache
} from '@apollo/client'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
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
import { Navigation } from './navigation'
import { NotificationsProvider } from './providers'

const styles = StyleSheet.create({
  gestureHandlerRootView: {
    flex: 1
  }
})

const httpLink = new HttpLink({
  uri: 'https://api.lens.dev',
  fetchOptions: 'no-cors',
  fetch
})

const apolloClient = new ApolloClient({
  link: from([httpLink]),
  cache: new InMemoryCache()
})

const livepeerClient = createReactClient({
  provider: studioProvider({ apiKey: 'b13fd43e-d0d6-4abc-a5df-93592a0c5124' })
})

const App = (): JSX.Element => {
  return (
    <ApolloProvider client={apolloClient}>
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
