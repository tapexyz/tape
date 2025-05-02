import { getPostMetadata } from "@/helpers/metadata";
import { Link } from "@tanstack/react-router";
import { FALLBACK_THUMBNAIL_URL } from "@tape.xyz/constants";
import type { Post } from "@tape.xyz/indexer";
import { tw } from "@tape.xyz/winder";
import { memo } from "react";

interface ByteCardProps {
  byte: Post;
  className?: string;
}

export const ByteCard = memo(({ byte, className }: ByteCardProps) => {
  const metadata = getPostMetadata(byte.metadata);

  return (
    <Link
      key={byte.id}
      to="/"
      className={tw(
        "relative h-[350px] flex-none shrink-0 overflow-hidden rounded-card",
        className
      )}
    >
      <img
        className="aspect-[9/16] h-full object-cover"
        src={metadata?.asset.cover ?? FALLBACK_THUMBNAIL_URL}
        alt="thumbnail"
        height={1000}
        width={600}
        draggable={false}
        onError={({ currentTarget }) => {
          currentTarget.src = FALLBACK_THUMBNAIL_URL;
        }}
      />
      <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-b from-transparent to-black px-4 py-2 text-sm">
        <h1 className="line-clamp-2 break-words font-medium text-white">
          {metadata?.title || metadata?.content}
        </h1>
      </div>
    </Link>
  );
});
