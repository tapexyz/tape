import { useDynamicContext } from '@dynamic-labs/sdk-react'
import { STATIC_ASSETS } from '@lenstube/constants'
import React from 'react'

import { Loader } from './Loader'
import QRCode from './QRCode'
import SignMessageButton from './SignMessageButton'

const Auth = () => {
  const { isFullyConnected, sdkHasLoaded } = useDynamicContext()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center space-y-10 p-24">
      {sdkHasLoaded ? (
        isFullyConnected ? (
          <>
            <p className="max-w-sm text-center">
              Help us verify that you are the owner of the connected wallet by
              signing the message.
            </p>

            <SignMessageButton />
            <QRCode value={`${STATIC_ASSETS}/images/brand/lenstube.svg`} />
          </>
        ) : (
          <h1 className="text-xl font-medium md:text-3xl">Welcome</h1>
        )
      ) : (
        <Loader />
      )}
    </main>
  )
}

export default Auth
