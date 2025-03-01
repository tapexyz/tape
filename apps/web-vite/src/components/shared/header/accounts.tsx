import { getAccountMetadata } from "@/helpers/metadata";
import { useAccountsAvailableQuery } from "@/queries/account";
import type { AccountAvailable } from "@tape.xyz/indexer";
import { Avatar, AvatarImage, Badge, Spinner } from "@tape.xyz/winder";

export const Accounts = () => {
  const { data, isLoading } = useAccountsAvailableQuery();
  const accounts = data?.accountsAvailable.items as AccountAvailable[];

  if (isLoading)
    return (
      <div className="grid h-64 place-items-center">
        <Spinner />
      </div>
    );

  return (
    <div className="flex flex-col">
      {accounts.map(({ account }) => {
        const { name, handleWithPrefix, picture, namespace } =
          getAccountMetadata(account);

        return (
          <button
            type="button"
            key={account.address}
            className="flex items-center justify-between gap-2 px-4 py-1.5 transition-colors hover:bg-secondary"
          >
            <span className="flex items-center gap-2">
              <div className="flex items-center justify-between gap-2">
                <Avatar size="md">
                  <AvatarImage src={picture} />
                </Avatar>
                <div className="flex flex-col justify-center text-left">
                  <span className="font-medium text-sm">{name}</span>
                  <span className="text-muted text-xs">{handleWithPrefix}</span>
                </div>
              </div>
            </span>
            <Badge variant="outline">{namespace}</Badge>
          </button>
        );
      })}
    </div>
  );
};
