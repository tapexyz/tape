import { getPostMetadata } from "@/helpers/metadata";
import { useBytesQuery } from "@/queries/post";
import { Link } from "@tanstack/react-router";
import { FALLBACK_THUMBNAIL_URL } from "@tape.xyz/constants";
import type { Post } from "@tape.xyz/indexer";

export const Bytes = () => {
  const { data, error } = useBytesQuery();

  const bytes = data?.pages.flatMap((page) => page.posts.items) as Post[];

  if (!bytes?.length || error) {
    return null;
  }

  return bytes.map((byte) => {
    return (
      <Link
        key={byte.id}
        to="/"
        className="relative aspect-[9/16] h-[350px] flex-none shrink-0 overflow-hidden rounded-card"
      >
        <img
          className="aspect-[9/16] h-full object-cover"
          src={getPostMetadata(byte.metadata)?.asset.cover}
          alt="thumbnail"
          height={1000}
          width={600}
          draggable={false}
          onError={({ currentTarget }) => {
            currentTarget.src = FALLBACK_THUMBNAIL_URL;
          }}
        />
        <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-b from-transparent to-black/50 px-4 py-2 text-xs">
          <h1 className="line-clamp-2 break-words text-white">
            {getPostMetadata(byte.metadata)?.content}
          </h1>
        </div>
      </Link>
    );
  });
};
