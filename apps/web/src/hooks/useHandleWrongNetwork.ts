import { POLYGON_CHAIN_ID } from "@tape.xyz/constants";
import { EVENTS } from "@tape.xyz/generic";
import { useConnections, useSwitchChain } from "wagmi";

import useSw from "./useSw";

const useHandleWrongNetwork = () => {
  const activeConnection = useConnections();
  const { switchChainAsync } = useSwitchChain();
  const { addEventToQueue } = useSw();

  const handleWrongNetwork = async () => {
    const activeChainId = activeConnection?.[0]?.chainId;
    if (activeChainId !== POLYGON_CHAIN_ID) {
      addEventToQueue(EVENTS.AUTH.SWITCH_NETWORK, {
        fromChainId: activeChainId
      });
      return await switchChainAsync({ chainId: POLYGON_CHAIN_ID });
    }

    return;
  };

  return handleWrongNetwork;
};

export default useHandleWrongNetwork;
