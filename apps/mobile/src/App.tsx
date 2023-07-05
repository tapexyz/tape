import 'react-native-reanimated'
// eslint-disable-next-line import/no-duplicates
import 'react-native-gesture-handler'

import { ApolloProvider } from '@apollo/client'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import {
  LENSTUBE_APP_DESCRIPTION,
  LENSTUBE_APP_NAME,
  LIVEPEER_STUDIO_API_KEY,
  WC_PROJECT_ID
} from '@lenstube/constants'
import apolloClient from '@lenstube/lens/apollo'
import {
  createReactClient,
  LivepeerConfig,
  studioProvider
} from '@livepeer/react-native'
import { WalletConnectModal } from '@walletconnect/modal-react-native'
import React from 'react'
import { StyleSheet } from 'react-native'
// eslint-disable-next-line import/no-duplicates
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import { AppLoading } from './components'
import mobileAuthLink from './helpers/auth-link'
import { usePushNotifications } from './hooks'
import { Navigation } from './navigation'
import { NotificationsProvider } from './providers'

const styles = StyleSheet.create({
  gestureHandlerRootView: {
    flex: 1
  }
})

const providerMetadata = {
  name: LENSTUBE_APP_NAME,
  description: LENSTUBE_APP_DESCRIPTION,
  url: 'https://lenstube.xyz/',
  icons: ['https://static.lenstube.xyz/images/brand/lenstube.svg'],
  redirect: {
    native: 'lenstube://',
    universal: 'lenstube.xyz'
  }
}

const livepeerClient = createReactClient({
  provider: studioProvider({ apiKey: LIVEPEER_STUDIO_API_KEY })
})

const App = (): JSX.Element => {
  usePushNotifications()

  return (
    <ApolloProvider client={apolloClient(mobileAuthLink)}>
      <LivepeerConfig client={livepeerClient}>
        <NotificationsProvider />
        <WalletConnectModal
          projectId={WC_PROJECT_ID}
          providerMetadata={providerMetadata}
          themeMode="dark"
        />
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
