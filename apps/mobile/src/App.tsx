import 'react-native-reanimated'
// eslint-disable-next-line import/no-duplicates
import 'react-native-gesture-handler'

import {
  LENSTUBE_APP_DESCRIPTION,
  LENSTUBE_APP_NAME,
  LENSTUBE_WEBSITE_URL,
  LIVEPEER_STUDIO_API_KEY,
  WC_PROJECT_ID
} from '@lenstube/constants'
import { apolloClient, ApolloProvider } from '@lenstube/lens/apollo'
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
import { SafeAreaProvider } from 'react-native-safe-area-context'

import AppLoading from './components/common/AppLoading'
import { ToastProvider } from './components/common/toast'
import mobileAuthLink from './helpers/auth-link'
import { Navigation } from './navigation'

const styles = StyleSheet.create({
  gestureHandlerRootView: {
    flex: 1
  }
})

const providerMetadata = {
  name: LENSTUBE_APP_NAME,
  description: LENSTUBE_APP_DESCRIPTION,
  url: LENSTUBE_WEBSITE_URL,
  icons: ['https://static.lenstube.xyz/images/brand/lenstube.svg'],
  redirect: {
    native: 'lenstube://',
    universal: 'lenstube.xyz'
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
    <AppLoading>
      <SafeAreaProvider>
        <ApolloProvider client={apolloClient(mobileAuthLink)}>
          <ToastProvider>
            <LivepeerConfig client={livepeerClient}>
              <WalletConnectModal
                themeMode="dark"
                projectId={WC_PROJECT_ID}
                explorerExcludedWalletIds="ALL"
                providerMetadata={providerMetadata}
                explorerRecommendedWalletIds={explorerRecommendedWalletIds}
              />
              <GestureHandlerRootView style={styles.gestureHandlerRootView}>
                <Navigation />
              </GestureHandlerRootView>
            </LivepeerConfig>
          </ToastProvider>
        </ApolloProvider>
      </SafeAreaProvider>
    </AppLoading>
  )
}

export default App
