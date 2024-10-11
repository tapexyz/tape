"use client";

import { Feed } from "@/components/home/feed";

export default function HomePage() {
  // void rqClient.prefetchInfiniteQuery(publicationsQuery);

  return (
    <div className="flex min-h-screen flex-col items-center p-24">
      {/* <HydrationBoundary state={dehydrate(rqClient)}> */}
      <Feed />
      {/* </HydrationBoundary> */}
    </div>
  );
}
