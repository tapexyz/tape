import { ButtonShimmer } from "@/components/shared/shimmers/button";
import { useAuthenticateMutation } from "@/queries/auth";
import { signIn } from "@/store/cookie";
import { useNavigate } from "@tanstack/react-router";
import type { AccountAvailable } from "@tape.xyz/indexer";
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  toast
} from "@tape.xyz/winder";
import { useState } from "react";
import { useAccount } from "wagmi";

type AuthenticateProps = {
  accounts: AccountAvailable[];
  loading: boolean;
};

export const Authenticate = ({ accounts, loading }: AuthenticateProps) => {
  const firstAccountAddress = accounts[0]?.account.address as string;
  const [chosenAccount, setChosenAccount] = useState(firstAccountAddress);
  const { isConnected } = useAccount();
  const navigate = useNavigate();

  const { mutateAsync: authenticate, isPending } =
    useAuthenticateMutation(chosenAccount);

  if (!isConnected) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-2">
        <ButtonShimmer />
        <ButtonShimmer />
      </div>
    );
  }

  const siwe = async () => {
    const result = await authenticate();
    if (result.authenticate.__typename === "AuthenticationTokens") {
      const { accessToken, refreshToken, idToken } = result.authenticate;
      signIn({ accessToken, refreshToken, identityToken: idToken });
      return navigate({ to: "/" });
    }
    toast.error(result.authenticate.reason);
  };

  return (
    <div className="flex items-center">
      {accounts.length ? (
        <div className="flex w-full flex-col gap-2">
          <Select
            value={chosenAccount}
            onValueChange={(value) => setChosenAccount(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an account" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map(({ account }) => (
                <SelectItem key={account.address} value={account.address}>
                  {account.username?.namespace.namespace}/
                  {account.username?.localName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button className="h-11 w-full" onClick={siwe} loading={isPending}>
            Sign in
          </Button>
        </div>
      ) : null}
    </div>
  );
};
