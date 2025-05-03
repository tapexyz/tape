import { usePostsQuery } from "@/queries/post";
import type { Post } from "@tape.xyz/indexer";

import { getTimeAgo } from "@/helpers/date-time";
import { getPostMetadata } from "@/helpers/metadata";
import { INFINITE_SCROLL_ROOT_MARGIN } from "@tape.xyz/constants";
import { Spinner, VideoPlayer } from "@tape.xyz/winder";
import { useInView } from "react-cool-inview";
export const Posts = () => {
  const { data, fetchNextPage, isLoading, hasNextPage } = usePostsQuery();

  const allPublications = data?.pages.flatMap(
    (page) => page.posts.items
  ) as Post[];

  const { observe } = useInView({
    rootMargin: INFINITE_SCROLL_ROOT_MARGIN,
    onEnter: async () => {
      await fetchNextPage();
    }
  });

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="my-5 flex w-full max-w-2xl flex-col gap-5">
      {allPublications.map((post) => {
        const metadata = getPostMetadata(post.metadata);

        const thumbnail = metadata?.asset.cover;
        const videoUrl = metadata?.asset.uri;
        return (
          <div key={post.id}>
            <VideoPlayer
              className="rounded-card-sm"
              posterClassName="rounded-card-sm"
              src={{ src: videoUrl, type: "video/mp4" }}
              poster={thumbnail}
              autoPlay={true}
              load="visible"
            />
            <h1 className="line-clamp-1 font-serif text-xl leading-[38px]">
              {metadata?.title || metadata?.content}
            </h1>
            <span className="text-muted">
              Published {getTimeAgo(post.timestamp)}
            </span>
          </div>
        );
      })}
      {hasNextPage && (
        <span ref={observe} className="flex justify-center p-10">
          <Spinner />
        </span>
      )}
    </div>
  );
};
