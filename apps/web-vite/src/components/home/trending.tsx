import { useMLPostsExploreQuery } from "@/queries/post";
import type { Post } from "@tape.xyz/indexer";
import {
  Spinner,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@tape.xyz/winder";
import { memo } from "react";
import { VideoCard } from "../shared/video-card";

export const Trending = memo(() => {
  const { data, isLoading } = useMLPostsExploreQuery();
  const trending = data?.pages.flatMap(
    (page) => page.mlPostsExplore.items
  ) as Post[];

  if (isLoading) {
    return <Spinner />;
  }

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
          <div className="grid gap-x-2 gap-y-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {trending?.map((post) => (
              <VideoCard key={post.slug} post={post} />
            ))}
          </div>
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
