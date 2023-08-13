import 'react-native-reanimated'
// eslint-disable-next-line import/no-duplicates
import 'react-native-gesture-handler'

import { ApolloProvider } from '@apollo/client'
import {
  LIVEPEER_STUDIO_API_KEY,
  PRIPE_APP_DESCRIPTION,
  PRIPE_APP_NAME,
  PRIPE_WEBSITE_URL,
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
import { Navigation } from './navigation'
import { NotificationsProvider, SafeAreaProvider } from './providers'

const styles = StyleSheet.create({
  gestureHandlerRootView: {
    flex: 1
  }
})

const providerMetadata = {
  name: PRIPE_APP_NAME,
  description: PRIPE_APP_DESCRIPTION,
  url: PRIPE_WEBSITE_URL,
  icons: ['https://static.lenstube.xyz/images/brand/lenstube.svg'],
  redirect: {
    native: 'pripe://',
    universal: 'pripe.xyz'
  }
}

const livepeerClient = createReactClient({
  provider: studioProvider({ apiKey: LIVEPEER_STUDIO_API_KEY })
})

const explorerRecommendedWalletIds = [
  'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96', // metamask
  'ecc4036f814562b41a5268adc86270fba1365471402006302e70169465b7ac18', // zerion
  '1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369', // rainbow
  '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0', // trust
  'c03dfee351b6fcc421b4494ea33b9d4b92a984f87aa76d1663bb28705e95034a', // uniswap
  '19177a98252e07ddfc9af2083ba8e07ef627cb6103467ffebb3f8f4205fd7927' // ledger live
]

const App = (): JSX.Element => {
  return (
    <SafeAreaProvider>
      <ApolloProvider client={apolloClient(mobileAuthLink)}>
        <LivepeerConfig client={livepeerClient}>
          <NotificationsProvider />
          <WalletConnectModal
            themeMode="dark"
            projectId={WC_PROJECT_ID}
            explorerExcludedWalletIds="ALL"
            providerMetadata={providerMetadata}
            explorerRecommendedWalletIds={explorerRecommendedWalletIds}
          />
          <AppLoading>
            <GestureHandlerRootView style={styles.gestureHandlerRootView}>
              <Navigation />
            </GestureHandlerRootView>
          </AppLoading>
        </LivepeerConfig>
      </ApolloProvider>
    </SafeAreaProvider>
  )
}

export default App
