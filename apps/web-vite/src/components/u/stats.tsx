import { useAccountStatsQuery } from "@/queries/account";
import type { Address } from "viem";

export const Stats = ({ account }: { account: Address }) => {
  const { data: stats } = useAccountStatsQuery(account);

  return (
    <div className="flex items-center space-x-2 text-sm">
      <p>
        {stats?.accountStats.graphFollowStats.followers}{" "}
        <span className="text-muted">followers</span>
      </p>
      <p>
        {stats?.accountStats.feedStats.posts}{" "}
        <span className="text-muted">posts</span>
      </p>
    </div>
  );
};
