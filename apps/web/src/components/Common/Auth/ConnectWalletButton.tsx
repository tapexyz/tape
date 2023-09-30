import { Button } from '@components/UIElements/Button'
import Tooltip from '@components/UIElements/Tooltip'
import { Analytics, TRACK } from '@lenstube/browser'
import type { CustomErrorWithData } from '@lenstube/lens/custom-types'
import useAuthPersistStore from '@lib/store/auth'
import { Trans } from '@lingui/macro'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import React from 'react'
import toast from 'react-hot-toast'
import { useAccount, useDisconnect } from 'wagmi'

import DisconnectOutline from '../Icons/DisconnectOutline'
import UserMenu from '../UserMenu'

type Props = {
  handleSign: () => void
  signing?: boolean
}

const ConnectWalletButton = ({ handleSign, signing }: Props) => {
  const selectedSimpleProfile = useAuthPersistStore(
    (state) => state.selectedSimpleProfile
  )

  const { isConnected } = useAccount()
  const { disconnect } = useDisconnect({
    onError(error: CustomErrorWithData) {
      toast.error(error?.data?.message ?? error?.message)
    }
  })
  const { openConnectModal } = useConnectModal()

  return isConnected ? (
    selectedSimpleProfile?.id ? (
      <UserMenu />
    ) : (
      <div className="flex items-center space-x-2">
        <Button
          loading={signing}
          onClick={() => handleSign()}
          disabled={signing}
        >
          <Trans>Sign In</Trans>
          <span className="ml-1 hidden md:inline-block">
            <Trans>with Lens</Trans>
          </span>
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
