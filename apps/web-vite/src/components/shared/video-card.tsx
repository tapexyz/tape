import { getAccountMetadata, getPostMetadata } from "@/helpers/metadata";
import { Link } from "@tanstack/react-router";
import type { Post } from "@tape.xyz/indexer";
import { Avatar, AvatarImage } from "@tape.xyz/winder";
import { memo } from "react";

export const VideoCard = memo(({ post }: { post: Post }) => {
  const metadata = getPostMetadata(post.metadata);
  const account = getAccountMetadata(post.author);

  return (
    <div key={post.id} className="flex flex-col gap-2">
      <div className="h-[203px] w-full rounded-card">
        <img
          src={metadata?.asset.cover}
          className="size-full rounded-card bg-secondary object-cover"
          alt={metadata?.title ?? ""}
          draggable={false}
        />
      </div>
      <div className="flex gap-2">
        <Avatar>
          <AvatarImage src={account.picture} />
        </Avatar>
        <div className="flex flex-col">
          <h1 className="line-clamp-2">
            {metadata?.title ?? metadata?.content}
          </h1>
          <div className="flex items-center gap-1 text-muted text-sm">
            <Link
              to="/u/$handle"
              params={{ handle: account.handle as string }}
              search={{ media: "videos" }}
            >
              {account.handle}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
});
