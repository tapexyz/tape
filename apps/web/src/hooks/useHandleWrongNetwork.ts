import { POLYGON_CHAIN_ID } from '@tape.xyz/constants'
import { EVENTS, Tower } from '@tape.xyz/generic'
import { useConnections, useSwitchChain } from 'wagmi'

const useHandleWrongNetwork = () => {
  const activeConnection = useConnections()
  const { switchChainAsync } = useSwitchChain()

  const handleWrongNetwork = async () => {
    const activeChainId = activeConnection?.[0]?.chainId
    if (activeChainId !== POLYGON_CHAIN_ID) {
      Tower.track(EVENTS.AUTH.SWITCH_NETWORK, {
        fromChainId: activeChainId
      })
      return await switchChainAsync({ chainId: POLYGON_CHAIN_ID })
    }

    return
  }

  return handleWrongNetwork
}

export default useHandleWrongNetwork
