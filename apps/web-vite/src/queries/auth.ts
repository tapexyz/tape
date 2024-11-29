import { execute } from "@/helpers/execute";
import { useMutation } from "@tanstack/react-query";
import { AuthenticateDocument, ChallengeDocument } from "@tape.xyz/indexer";
import { useAccount, useSignMessage } from "wagmi";

export const useChallengeMutation = (account: string) => {
  const { address } = useAccount();
  return useMutation({
    mutationFn: () =>
      execute(ChallengeDocument, {
        request: {
          accountManager: {
            account,
            manager: address
          }
        }
      })
  });
};

export const useAuthenticateMutation = (account: string) => {
  const { signMessageAsync } = useSignMessage();
  const { mutateAsync: getChallenge } = useChallengeMutation(account);

  return useMutation({
    mutationFn: async () => {
      const {
        challenge: { text, id }
      } = await getChallenge();
      const signature = await signMessageAsync({ message: text });

      return execute(AuthenticateDocument, {
        request: {
          id,
          signature
        }
      });
    }
  });
};
