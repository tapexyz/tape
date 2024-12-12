import { Virtualized } from "@/components/shared/virtualized";
import { getPostMetadata } from "@/helpers/metadata";
import { usePostsQuery } from "@/queries/post";
import type { Post } from "@tape.xyz/indexer";

export const Posts = () => {
  const { data, fetchNextPage, isLoading, hasNextPage } = usePostsQuery();

  const allPublications = data?.pages.flatMap(
    (page) => page.posts.items
  ) as Post[];

  if (isLoading) {
    return <div>loading</div>;
  }

  if (!allPublications) {
    return <div>not found</div>;
  }

  return (
    <div className="w-full max-w-2xl divide-y divide-gray-400 rounded-custom bg-white">
      <Virtualized
        restoreScroll
        data={allPublications}
        endReached={fetchNextPage}
        hasNextPage={hasNextPage}
        itemContent={(_index, post) => {
          const metadata = getPostMetadata(post.metadata);
          return (
            <div className="p-5">
              {metadata?.content}
              <video controls className="aspect-video w-full rounded-custom">
                <source src={metadata?.asset?.uri} type="video/mp4" />
                <track kind="captions" />
              </video>
            </div>
          );
        }}
      />
    </div>
  );
};
