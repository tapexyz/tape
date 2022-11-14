import { Button } from '@components/UIElements/Button'
import useAppStore from '@lib/store'
import usePersistStore from '@lib/store/persist'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { POLYGON_CHAIN_ID } from '@utils/constants'
import React from 'react'
import toast from 'react-hot-toast'
import type { CustomErrorWithData } from 'src/types/local'
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi'

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
  const { chain } = useNetwork()

  const { openConnectModal } = useConnectModal()

  return connector?.id && isConnected ? (
    chain?.id === POLYGON_CHAIN_ID ? (
      selectedChannelId && selectedChannel ? (
        <UserMenu />
      ) : (
        <Button
          loading={signing}
          onClick={() => handleSign()}
          disabled={signing}
        >
          Sign In
          <span className="hidden ml-1 md:inline-block">with Lens</span>
        </Button>
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
    <Button onClick={openConnectModal}>
      Connect
      <span className="hidden ml-1 md:inline-block">Wallet</span>
    </Button>
  )
}

export default ConnectWalletButton
