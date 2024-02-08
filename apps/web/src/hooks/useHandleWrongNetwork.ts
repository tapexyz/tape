import { POLYGON_CHAIN_ID } from '@tape.xyz/constants'
import { EVENTS, Tower } from '@tape.xyz/generic'
import { useConnections, useSwitchChain } from 'wagmi'

const useHandleWrongNetwork = () => {
  const activeConnection = useConnections()
  const { switchChainAsync } = useSwitchChain()

  const handleWrongNetwork = async () => {
    if (activeConnection[0].chainId !== POLYGON_CHAIN_ID) {
      Tower.track(EVENTS.AUTH.SWITCH_NETWORK, {
        fromChainId: activeConnection[0].chainId
      })
      return await switchChainAsync({ chainId: POLYGON_CHAIN_ID })
    }

    return false
  }

  return handleWrongNetwork
}

export default useHandleWrongNetwork
