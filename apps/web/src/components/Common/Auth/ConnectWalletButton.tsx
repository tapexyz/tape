import { Button } from '@components/UIElements/Button'
import Tooltip from '@components/UIElements/Tooltip'
import { Analytics, TRACK } from '@lenstube/browser'
import { POLYGON_CHAIN_ID } from '@lenstube/constants'
import type { CustomErrorWithData } from '@lenstube/lens/custom-types'
import useAuthPersistStore from '@lib/store/auth'
import { Trans } from '@lingui/macro'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useAccount, useDisconnect, useNetwork, useSwitchNetwork } from 'wagmi'

import DisconnectOutline from '../Icons/DisconnectOutline'
import UserMenu from '../UserMenu'
import SelectProfile from './SelectProfile'

const ConnectWalletButton = () => {
  const [showSelectProfile, setShowSelectProfile] = useState(false)
  const selectedSimpleProfile = useAuthPersistStore(
    (state) => state.selectedSimpleProfile
  )

  const { isConnected } = useAccount()
  const { switchNetwork } = useSwitchNetwork({
    onError(error: CustomErrorWithData) {
      toast.error(error?.data?.message ?? error?.message)
    }
  })
  const { disconnect } = useDisconnect({
    onError(error: CustomErrorWithData) {
      toast.error(error?.data?.message ?? error?.message)
    }
  })
  const { chain } = useNetwork()

  const { openConnectModal } = useConnectModal()

  return isConnected ? (
    chain?.id === POLYGON_CHAIN_ID ? (
      selectedSimpleProfile?.id ? (
        <UserMenu />
      ) : (
        <div className="flex items-center space-x-2">
          <SelectProfile
            show={showSelectProfile}
            setShow={setShowSelectProfile}
          />
          <Button onClick={() => setShowSelectProfile(true)}>
            <Trans>Sign In</Trans>
          </Button>
          <Tooltip content="Disconnect Wallet">
            <button
              className="btn-danger p-2 md:p-2.5"
              onClick={() => disconnect?.()}
            >
              <DisconnectOutline className="h-4 w-4" />
            </button>
          </Tooltip>
        </div>
      )
    ) : (
      <Button
        onClick={() => switchNetwork && switchNetwork(POLYGON_CHAIN_ID)}
        variant="danger"
      >
        <span className="text-white">
          <Trans>Switch network</Trans>
        </span>
      </Button>
    )
  ) : (
    <Button
      onClick={() => {
        if (openConnectModal) {
          openConnectModal()
          Analytics.track(TRACK.AUTH.CONNECT_WALLET)
        } else {
          disconnect?.()
        }
      }}
    >
      <Trans>Connect</Trans>
      <span className="ml-1 hidden md:inline-block">
        <Trans>Wallet</Trans>
      </span>
    </Button>
  )
}

export default ConnectWalletButton
