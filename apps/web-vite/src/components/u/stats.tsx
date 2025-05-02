import { useAccountStatsQuery } from "@/queries/account";

export const Stats = ({ address }: { address: string }) => {
  const { data: stats } = useAccountStatsQuery(address);

  return (
    <div className="flex items-center space-x-2 text-sm">
      <p>
        {stats?.accountStats.graphFollowStats.followers}{" "}
        <span className="text-muted">followers</span>
      </p>
      <p>
        {stats?.accountStats.feedStats.posts}{" "}
        <span className="text-muted">videos</span>
      </p>
    </div>
  );
};
