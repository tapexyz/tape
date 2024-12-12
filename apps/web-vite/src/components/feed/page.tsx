import { useBytesSuspenseQuery } from "@/queries/post";
import type { Post } from "@tape.xyz/indexer";
import { Virtualized } from "../shared/virtualized";
import { Byte } from "./byte";

export const FeedPage = () => {
  const { data, fetchNextPage, hasNextPage } = useBytesSuspenseQuery();

  const allBytes = data.pages.flatMap((page) => page.posts.items) as Post[];

  return (
    <div className="flex flex-col items-center p-5">
      <div className="min-h-screen w-full max-w-[420px]">
        <Virtualized
          restoreScroll
          data={allBytes}
          endReached={fetchNextPage}
          hasNextPage={hasNextPage}
          itemContent={(_index, post) => <Byte post={post} />}
        />
      </div>
    </div>
  );
};
