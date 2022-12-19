import '../styles/index.css'

import { ApolloProvider } from '@apollo/client'
import { LivepeerConfig } from '@livepeer/react'
import mixpanel from 'mixpanel-browser'
import type { AppProps } from 'next/app'
import React from 'react'
import { MIXPANEL_API_HOST, MIXPANEL_TOKEN } from 'utils'
import getApolloClient from 'utils/functions/getApolloClient'
import { getLivepeerClient, videoPlayerTheme } from 'utils/functions/livepeer'

const apolloClient = getApolloClient()

function MyApp({ Component, pageProps }: AppProps) {
  if (MIXPANEL_TOKEN) {
    mixpanel.init(MIXPANEL_TOKEN, {
      api_host: MIXPANEL_API_HOST
    })
  }
  return (
    <LivepeerConfig client={getLivepeerClient()} theme={videoPlayerTheme}>
      <ApolloProvider client={apolloClient}>
        <Component {...pageProps} />
      </ApolloProvider>
    </LivepeerConfig>
  )
}

export default MyApp
