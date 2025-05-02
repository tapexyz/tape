import { useBytesSuspenseQuery } from "@/queries/post";
import { INFINITE_SCROLL_ROOT_MARGIN } from "@tape.xyz/constants";
import type { Post } from "@tape.xyz/indexer";
import { Spinner } from "@tape.xyz/winder";
import { useInView } from "react-cool-inview";
import { Byte } from "./byte";

export const FeedPage = () => {
  const { data, fetchNextPage, hasNextPage } = useBytesSuspenseQuery();

  const allBytes = data.pages
    .flatMap((page) => page?.posts?.items)
    .filter(Boolean) as Post[];

  const { observe } = useInView({
    rootMargin: INFINITE_SCROLL_ROOT_MARGIN,
    onEnter: async () => {
      await fetchNextPage();
    }
  });

  return (
    <div className="flex flex-col items-center p-5">
      <div className="min-h-screen w-full max-w-[420px]">
        {allBytes.map((post) => (
          <Byte key={post.id} post={post} />
        ))}
        {hasNextPage && (
          <span ref={observe} className="flex justify-center p-10">
            <Spinner />
          </span>
        )}
      </div>
    </div>
  );
};
