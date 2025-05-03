import { getAccountMetadata } from "@/helpers/metadata";
import { useFollowersYouKnowInfiniteQuery } from "@/queries/account";
import type { Follower } from "@tape.xyz/indexer";
import { Avatar, AvatarImage } from "@tape.xyz/winder";
import type { Address } from "viem";

export const Mutuals = ({ account }: { account: Address }) => {
  const { data: followers } = useFollowersYouKnowInfiniteQuery(account);
  if (!followers) return null;
  const accounts = followers.pages
    .flatMap((page) => page.followersYouKnow.items)
    .slice(0, 5) as Follower[];

  return (
    <div className="flex">
      <span className="-space-x-1.5 flex rounded-full bg-primary/10 p-1">
        {accounts.map(({ follower }) => (
          <Avatar size="xs" shape="circle" key={follower.address}>
            <AvatarImage src={getAccountMetadata(follower).picture} />
          </Avatar>
        ))}
      </span>
    </div>
  );
};
