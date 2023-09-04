'use client'

import { DynamicContextProvider } from '@dynamic-labs/sdk-react'
import { LENSTUBE_WEBSITE_URL, STATIC_ASSETS } from '@lenstube/constants'
import { imageCdn } from '@lenstube/generic'
import { apolloClient, ApolloProvider } from '@lenstube/lens/apollo'
import React from 'react'

import Auth from '@/components/Auth'
import Header from '@/components/Header'

const cssOverrides = `
  .non-widget-network-picker {
    display: none;
  }
`

const Home = () => {
  return (
    <ApolloProvider client={apolloClient()}>
      <DynamicContextProvider
        settings={{
          environmentId: 'ec7de4c5-ed26-4fdd-9805-75cfda04108a',
          initialAuthenticationMode: 'connect-only',
          appLogoUrl: imageCdn(
            `${STATIC_ASSETS}/images/brand/lenstube.svg`,
            'AVATAR'
          ),
          privacyPolicyUrl: `${LENSTUBE_WEBSITE_URL}/privacy`,
          termsOfServiceUrl: `${LENSTUBE_WEBSITE_URL}/terms`,
          cssOverrides
        }}
      >
        <Header />
        <Auth />
      </DynamicContextProvider>
    </ApolloProvider>
  )
}

export default Home
