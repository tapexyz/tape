import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

import { Feed } from "@/components/home/feed";
import { publicationsQuery } from "@/components/home/queries";

import { rqClient } from "./providers/react-query";

export default function HomePage() {
  void rqClient.prefetchInfiniteQuery(publicationsQuery);

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <HydrationBoundary state={dehydrate(rqClient)}>
        <Feed />
      </HydrationBoundary>
    </main>
  );
}
