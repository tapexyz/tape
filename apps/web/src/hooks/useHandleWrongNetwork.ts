import useNetworkStore from '@lib/store/network'
import { POLYGON_CHAIN_ID } from '@tape.xyz/constants'
import { useCallback } from 'react'
import { useChainId } from 'wagmi'

const useHandleWrongNetwork = () => {
  const setShowSwitchNetwork = useNetworkStore(
    (state) => state.setShowSwitchNetwork
  )
  const chain = useChainId()

  const handleWrongNetwork = useCallback(() => {
    if (chain !== POLYGON_CHAIN_ID) {
      setShowSwitchNetwork(true)
      return true
    }

    return false
  }, [chain, setShowSwitchNetwork])

  return handleWrongNetwork
}

export default useHandleWrongNetwork
