import { useAccountPostsQuery } from "@/queries/post";
import { INFINITE_SCROLL_ROOT_MARGIN } from "@tape.xyz/constants";
import type { Post } from "@tape.xyz/indexer";
import { Spinner } from "@tape.xyz/winder";
import { useInView } from "react-cool-inview";
import { VideoCard } from "../shared/video-card";

interface VideosProps {
  address: string;
}

export const Videos = ({ address }: VideosProps) => {
  const { data, isLoading, fetchNextPage, hasNextPage } =
    useAccountPostsQuery(address);
  const videos = data?.pages
    .flatMap((page) => page?.posts?.items)
    .filter(Boolean) as Post[];

  const { observe } = useInView({
    rootMargin: INFINITE_SCROLL_ROOT_MARGIN,
    onEnter: async () => {
      await fetchNextPage();
    }
  });

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <div className="grid gap-x-2 gap-y-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {videos?.map((post) => (
          <VideoCard key={post.slug} post={post} />
        ))}
      </div>
      {hasNextPage && (
        <span ref={observe} className="flex justify-center p-10">
          <Spinner />
        </span>
      )}
    </>
  );
};
