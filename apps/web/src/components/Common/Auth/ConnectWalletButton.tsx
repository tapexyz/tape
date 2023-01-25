import { Button } from '@components/UIElements/Button'
import Tooltip from '@components/UIElements/Tooltip'
import useAppStore from '@lib/store'
import usePersistStore from '@lib/store/persist'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import React from 'react'
import toast from 'react-hot-toast'
import { AiOutlineDisconnect } from 'react-icons/ai'
import type { CustomErrorWithData } from 'utils'
import { Analytics, POLYGON_CHAIN_ID, TRACK } from 'utils'
import { useAccount, useDisconnect, useNetwork, useSwitchNetwork } from 'wagmi'

import UserMenu from '../UserMenu'

type Props = {
  handleSign: () => void
  signing?: boolean
}

const ConnectWalletButton = ({ handleSign, signing }: Props) => {
  const selectedChannelId = usePersistStore((state) => state.selectedChannelId)
  const selectedChannel = useAppStore((state) => state.selectedChannel)

  const { connector, isConnected } = useAccount()
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

  return connector?.id && isConnected ? (
    chain?.id === POLYGON_CHAIN_ID ? (
      selectedChannelId && selectedChannel ? (
        <UserMenu />
      ) : (
        <div className="flex items-center space-x-2">
          <Button
            loading={signing}
            onClick={() => handleSign()}
            disabled={signing}
          >
            Sign In
            <span className="hidden ml-1 md:inline-block">with Lens</span>
          </Button>
          <Tooltip content="Disconnect Wallet">
            <button
              className="btn-danger md:p-2.5 p-2"
              onClick={() => disconnect?.()}
            >
              <AiOutlineDisconnect className="text-lg" />
            </button>
          </Tooltip>
        </div>
      )
    ) : (
      <Button
        onClick={() => switchNetwork && switchNetwork(POLYGON_CHAIN_ID)}
        variant="danger"
      >
        <span className="text-white">Switch network</span>
      </Button>
    )
  ) : (
    <Button
      onClick={() => {
        openConnectModal?.()
        Analytics.track(TRACK.AUTH.CLICK_CONNECT_WALLET)
      }}
    >
      Connect
      <span className="hidden ml-1 md:inline-block">Wallet</span>
    </Button>
  )
}

export default ConnectWalletButton
