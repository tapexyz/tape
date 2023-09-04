import { STATIC_ASSETS } from '@lenstube/constants'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import React, { useEffect } from 'react'
import { useAccount, useDisconnect } from 'wagmi'

import usePersistStore from '@/persist'

const Header = () => {
  const { openConnectModal } = useConnectModal()
  const { address } = useAccount()
  const { disconnectAsync } = useDisconnect()
  const storeTokens = usePersistStore((state) => state.storeTokens)

  useEffect(() => {
    if (!address) {
      openConnectModal?.()
    }
  }, [address, openConnectModal])

  const clearAll = async () => {
    storeTokens({ accessToken: null, refreshToken: null })
    await disconnectAsync()
    localStorage.clear()
  }

  return (
    <div className="absolute flex h-28 w-full items-center justify-between p-5 md:px-7">
      <img
        src={`${STATIC_ASSETS}/images/brand/lenstube.svg`}
        className="h-12 w-12"
        alt="lenstube"
        width={12}
        height={12}
        draggable={false}
      />
      <button
        className="rounded-xl border border-gray-800 bg-gray-900 px-6 py-2 focus:outline-none"
        onClick={() => (address ? clearAll() : openConnectModal?.())}
      >
        {address ? 'Disconnect' : 'Connect Wallet'}
      </button>
    </div>
  )
}

export default Header
