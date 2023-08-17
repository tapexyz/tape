import './expo-crypto-shim.js'

import { registerRootComponent } from 'expo'
import React from 'react'

import App from './src/App'

// Only require and initialize why-did-you-render in development mode
if (__DEV__) {
  const whyDidYouRender = require('@welldone-software/why-did-you-render')
  whyDidYouRender(React, {
    trackAllPureComponents: false,
    trackHooks: false,
    logOnDifferentValues: false
  })
}

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App)
