import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@tape.xyz/winder";
import { HorizontalView } from "../shared/horizontal-view";
import { Bytes } from "./bytes";
import { publicationsQuery } from "./queries";

export const Feed = () => {
  const { data, fetchNextPage, hasNextPage } =
    useSuspenseInfiniteQuery(publicationsQuery);

  return (
    <div className="rounded-card bg-theme p-5">
      <div className="space-y-36">
        <h1 className="max-w-screen-lg font-serif text-[58px] leading-[58px]">
          Discover content from a wide variety of channels & creators
          <span>
            <img
              src="/images/hand.webp"
              className="ml-2 inline-block size-12 select-none"
              draggable={false}
              alt="hand"
            />
          </span>
        </h1>
        <Tabs defaultValue="all-time">
          <div className="space-x-10 text-xl">
            <span>Curated by Tape</span>
            <TabsList>
              <TabsTrigger value="all-time">All time</TabsTrigger>
              <TabsTrigger value="this-month">This month</TabsTrigger>
              <TabsTrigger value="this-week">This week</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="all-time">
            <div>Content all time.</div>
          </TabsContent>
          <TabsContent value="month">
            <div>Content this month.</div>
          </TabsContent>
          <TabsContent value="week">
            <div>Content this week.</div>
          </TabsContent>
        </Tabs>
      </div>
      <div className="mt-24">
        <HorizontalView heading="Tape Bytes">
          <Bytes />
        </HorizontalView>
      </div>
      <div className="mt-24">
        <Tabs defaultValue="all-time">
          <div className="space-x-10 text-xl">
            <span>Trending videos</span>
            <TabsList>
              <TabsTrigger value="all-time">All time</TabsTrigger>
              <TabsTrigger value="this-month">This month</TabsTrigger>
              <TabsTrigger value="this-week">This week</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="all-time">
            <div>Content all time.</div>
          </TabsContent>
          <TabsContent value="month">
            <div>Content this month.</div>
          </TabsContent>
          <TabsContent value="week">
            <div>Content this week.</div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
