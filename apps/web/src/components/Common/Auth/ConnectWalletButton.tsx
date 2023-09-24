import Tooltip from '@components/UIElements/Tooltip'
import { Analytics, TRACK } from '@lenstube/browser'
import { POLYGON_CHAIN_ID } from '@lenstube/constants'
import type { CustomErrorWithData } from '@lenstube/lens/custom-types'
import useAuthPersistStore from '@lib/store/auth'
import { Trans } from '@lingui/macro'
import { LinkBreak1Icon } from '@radix-ui/react-icons'
import { Button } from '@radix-ui/themes'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import React from 'react'
import toast from 'react-hot-toast'
import { useAccount, useDisconnect, useNetwork, useSwitchNetwork } from 'wagmi'

import UserMenu from '../UserMenu'
import SelectProfile from './SelectProfile'

const ConnectWalletButton = () => {
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
          <SelectProfile />
          <Tooltip content="Disconnect Wallet">
            <Button variant="soft" onClick={() => disconnect?.()}>
              <LinkBreak1Icon />
            </Button>
          </Tooltip>
        </div>
      )
    ) : (
      <Button
        onClick={() => switchNetwork && switchNetwork(POLYGON_CHAIN_ID)}
        color="red"
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
      <Trans>Connect</Trans>{' '}
      <span className="hidden md:inline-block">
        <Trans>Wallet</Trans>
      </span>
    </Button>
  )
}

export default ConnectWalletButton
