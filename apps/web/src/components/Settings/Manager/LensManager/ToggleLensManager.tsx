import { LENSHUB_PROXY_ABI } from "@tape.xyz/abis";
import {
  ERROR_MESSAGE,
  LENSHUB_PROXY_ADDRESS,
  REQUESTING_SIGNATURE_MESSAGE
} from "@tape.xyz/constants";
import {
  EVENTS,
  checkLensManagerPermissions,
  getSignature
} from "@tape.xyz/generic";
import type { Profile } from "@tape.xyz/lens";
import {
  useBroadcastOnchainMutation,
  useCreateChangeProfileManagersTypedDataMutation
} from "@tape.xyz/lens";
import type { CustomErrorWithData } from "@tape.xyz/lens/custom-types";
import { Button } from "@tape.xyz/ui";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSignTypedData, useWriteContract } from "wagmi";

import useHandleWrongNetwork from "@/hooks/useHandleWrongNetwork";
import usePendingTxn from "@/hooks/usePendingTxn";
import useSw from "@/hooks/useSw";
import useProfileStore from "@/lib/store/idb/profile";
import useNonceStore from "@/lib/store/nonce";

const ToggleLensManager = () => {
  const [loading, setLoading] = useState(false);
  const { addEventToQueue } = useSw();

  const { activeProfile, setActiveProfile } = useProfileStore();
  const { lensHubOnchainSigNonce, setLensHubOnchainSigNonce } = useNonceStore();
  const handleWrongNetwork = useHandleWrongNetwork();
  const { canBroadcast } = checkLensManagerPermissions(activeProfile);

  const isLensManagerEnabled = activeProfile?.signless || false;

  const onError = (error: CustomErrorWithData) => {
    toast.error(error?.message ?? ERROR_MESSAGE);
    setLoading(false);
  };

  const { signTypedDataAsync } = useSignTypedData({
    mutation: { onError }
  });

  const { writeContractAsync, data: txHash } = useWriteContract({
    mutation: {
      onSuccess: () => {
        setLensHubOnchainSigNonce(lensHubOnchainSigNonce + 1);
      },
      onError: (error) => {
        onError(error);
        setLensHubOnchainSigNonce(lensHubOnchainSigNonce - 1);
      }
    }
  });

  const write = async ({ args }: { args: any[] }) => {
    return await writeContractAsync({
      address: LENSHUB_PROXY_ADDRESS,
      abi: LENSHUB_PROXY_ABI,
      functionName: "changeDelegatedExecutorsConfig",
      args
    });
  };

  const [broadcast, { data: broadcastData }] = useBroadcastOnchainMutation({
    onError
  });

  const { indexed } = usePendingTxn({
    txHash,
    ...(broadcastData?.broadcastOnchain.__typename === "RelaySuccess" && {
      txId: broadcastData?.broadcastOnchain?.txId
    })
  });

  useEffect(() => {
    if (indexed) {
      toast.success(
        `Lens Manager ${isLensManagerEnabled ? "disabled" : "enabled"}`
      );
      const channel = { ...activeProfile };
      channel.signless = !isLensManagerEnabled;
      setActiveProfile(channel as Profile);
      setLoading(false);
      addEventToQueue(EVENTS.MANAGER.TOGGLE, { enabled: channel.signless });
    }
  }, [indexed]);

  const [toggleLensManager] = useCreateChangeProfileManagersTypedDataMutation({
    onCompleted: async ({ createChangeProfileManagersTypedData }) => {
      const { id, typedData } = createChangeProfileManagersTypedData;
      const {
        delegatorProfileId,
        delegatedExecutors,
        approvals,
        configNumber,
        switchToGivenConfig
      } = typedData.value;
      const args = [
        delegatorProfileId,
        delegatedExecutors,
        approvals,
        configNumber,
        switchToGivenConfig
      ];
      try {
        toast.loading(REQUESTING_SIGNATURE_MESSAGE);
        if (canBroadcast) {
          const signature = await signTypedDataAsync(getSignature(typedData));
          const { data } = await broadcast({
            variables: { request: { id, signature } }
          });
          if (data?.broadcastOnchain?.__typename === "RelayError") {
            return await write({ args });
          }
          return;
        }
        return await write({ args });
      } catch {
        setLoading(false);
      }
    },
    onError
  });

  const onClick = async () => {
    await handleWrongNetwork();

    setLoading(true);
    return toggleLensManager({
      variables: {
        options: { overrideSigNonce: lensHubOnchainSigNonce },
        request: {
          approveSignless: !isLensManagerEnabled
        }
      }
    });
  };

  const getButtonText = () => {
    if (isLensManagerEnabled) {
      return "Disable";
    }
    return "Enable";
  };

  return (
    <Button
      onClick={onClick}
      disabled={loading}
      loading={loading}
      variant={isLensManagerEnabled ? "danger" : "primary"}
    >
      {getButtonText()}
    </Button>
  );
};

export default ToggleLensManager;
