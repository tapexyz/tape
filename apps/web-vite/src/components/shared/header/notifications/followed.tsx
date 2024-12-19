import { getAccountMetadata } from "@/helpers/metadata";
import { Link } from "@tanstack/react-router";
import type { FollowNotification } from "@tape.xyz/indexer";
import { Avatar, AvatarImage } from "@tape.xyz/winder";

export const Followed = ({
  notification
}: { notification: FollowNotification }) => {
  return (
    <div className="flex flex-col gap-1.5 overflow-hidden border-custom border-b p-4 hover:bg-secondary">
      <div className="flex items-center gap-2">
        {notification.followers.map(({ account }) => (
          <Link
            to="/u/$handle"
            key={account.address}
            params={{ handle: getAccountMetadata(account).handle as string }}
            search={{ media: "videos" }}
          >
            <Avatar size="sm" shape="circle">
              <AvatarImage src={getAccountMetadata(account).picture} />
            </Avatar>
          </Link>
        ))}
      </div>
      <span className="text-primary/50 text-sm">
        {notification.followers.length} new{" "}
        {notification.followers.length > 1 ? "followers" : "follower"}
      </span>
    </div>
  );
};
