import { LENSTUBE_WEBSITE_URL } from '@lenstube/constants'
import React, { useEffect } from 'react'
import { useAccount } from 'wagmi'

import usePersistStore from '@/persist'

import QRCode from './QRCode'
import SignMessageButton from './SignMessageButton'

const Auth = () => {
  const accessToken = usePersistStore((state) => state.accessToken)
  const refreshToken = usePersistStore((state) => state.refreshToken)
  const { address } = useAccount()

  useEffect(() => {
    if (!address) {
      localStorage.clear()
    }
  }, [address])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center space-y-10 p-24">
      {address ? (
        <div className="space-y-5">
          <p className="max-w-sm text-center">
            {accessToken
              ? 'Scan using Pripe Mobile'
              : 'Help us verify that you are the owner of the connected wallet by signing the message.'}
          </p>
          {accessToken ? (
            <QRCode value={JSON.stringify({ accessToken, refreshToken })} />
          ) : (
            <SignMessageButton />
          )}
        </div>
      ) : (
        <div className="space-y-5">
          <h1 className="text-center text-xl">Get the App</h1>
          <QRCode value={LENSTUBE_WEBSITE_URL} />
        </div>
      )}
    </main>
  )
}

export default Auth
