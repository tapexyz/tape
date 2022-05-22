import { useQuery } from "@apollo/client";
import { TX_STATUS_QUERY } from "@utils/gql/queries";
import { useEffect } from "react";

const usePendingTxn = (txHash: string) => {
  const { data, loading, stopPolling } = useQuery(TX_STATUS_QUERY, {
    variables: {
      request: { txHash },
    },
    skip: txHash.length === 0,
    pollInterval: 1000,
  });

  useEffect(() => {
    const checkIsIndexed = async () => {
      if (data?.hasTxHashBeenIndexed?.indexed) {
        stopPolling();
      }
    };
    checkIsIndexed();
  }, [data, stopPolling]);

  return { indexed: data?.hasTxHashBeenIndexed?.indexed, loading };
};

export default usePendingTxn;
