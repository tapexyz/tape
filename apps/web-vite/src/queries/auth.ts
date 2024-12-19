import { execute } from "@/helpers/execute";
import { useMutation } from "@tanstack/react-query";
import {
  AuthenticateDocument,
  ChallengeDocument,
  type ChallengeRequest
} from "@tape.xyz/indexer";
import { AUTH_CHALLENGE_TYPE } from "@tape.xyz/indexer/custom-types";
import { useAccount, useSignMessage } from "wagmi";

const useChallengeMutation = (type: AUTH_CHALLENGE_TYPE, account?: string) => {
  const { address } = useAccount();

  const request: ChallengeRequest =
    type === AUTH_CHALLENGE_TYPE.ACCOUNT_MANAGER
      ? { accountManager: { account, manager: address } }
      : type === AUTH_CHALLENGE_TYPE.ONBOARDING_USER
        ? { onboardingUser: { wallet: address } }
        : { accountOwner: { account, owner: address } };

  return useMutation({
    mutationFn: () =>
      execute({
        query: ChallengeDocument,
        variables: {
          request
        }
      })
  });
};

type SIWEParams =
  | { type: AUTH_CHALLENGE_TYPE.ONBOARDING_USER }
  | {
      type:
        | AUTH_CHALLENGE_TYPE.ACCOUNT_MANAGER
        | AUTH_CHALLENGE_TYPE.ACCOUNT_OWNER;
      account: string;
    };

export const useAuthenticateMutation = (params: SIWEParams) => {
  const { signMessageAsync } = useSignMessage();
  const { mutateAsync: getChallenge } = useChallengeMutation(
    params.type,
    "account" in params ? params.account : undefined
  );

  return useMutation({
    mutationFn: async () => {
      const {
        challenge: { text, id }
      } = await getChallenge();
      const signature = await signMessageAsync({ message: text });

      return execute({
        query: AuthenticateDocument,
        variables: {
          request: {
            id,
            signature
          }
        }
      });
    }
  });
};
