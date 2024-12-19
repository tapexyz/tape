import { usePostsQuery } from "@/queries/post";
import type { Post } from "@tape.xyz/indexer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@tape.xyz/winder";
import { memo } from "react";
import { VideoCard } from "../shared/video-card";
import { Virtualized } from "../shared/virtualized";

export const Trending = memo(() => {
  const { data, fetchNextPage, hasNextPage } = usePostsQuery();
  const trending = data?.pages.flatMap((page) => page.posts.items) as Post[];

  return (
    <div className="mt-24">
      <Tabs defaultValue="all-time">
        <div className="mb-5 space-x-10 text-xl">
          <span>Trending videos</span>
          <TabsList>
            <TabsTrigger value="all-time">All time</TabsTrigger>
            <TabsTrigger value="this-month">This month</TabsTrigger>
            <TabsTrigger value="this-week">This week</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="all-time">
          <Virtualized
            grid
            restoreScroll
            data={trending}
            endReached={fetchNextPage}
            hasNextPage={hasNextPage}
            itemContent={(_index, post) => (
              <VideoCard key={post.id} post={post} />
            )}
          />
        </TabsContent>
        <TabsContent value="month">
          <div>Content this month.</div>
        </TabsContent>
        <TabsContent value="week">
          <div>Content this week.</div>
        </TabsContent>
      </Tabs>
    </div>
  );
});
