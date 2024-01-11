import useNetworkStore from '@lib/store/network'
import { POLYGON_CHAIN_ID } from '@tape.xyz/constants'
import { Button, Modal } from '@tape.xyz/ui'
import React from 'react'
import { useSwitchChain } from 'wagmi'

const SwitchNetworkDialog = () => {
  const { showSwitchNetwork, setShowSwitchNetwork } = useNetworkStore()
  const { switchChainAsync } = useSwitchChain()

  if (!showSwitchNetwork) {
    return null
  }

  return (
    <Modal
      title="Switch network"
      description="Connect to the right network to continue"
      show={showSwitchNetwork}
      setShow={setShowSwitchNetwork}
    >
      <div className="flex justify-end">
        <Button
          variant="danger"
          onClick={async () => {
            await switchNetworkAsync?.(POLYGON_CHAIN_ID)
            setShowSwitchNetwork(false)
          }}
        >
          Switch Network
        </Button>
      </div>
    </Modal>
  )
}

export default SwitchNetworkDialog
