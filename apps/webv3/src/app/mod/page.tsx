import { rqClient } from "@/providers/react-query";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

export default function ModPage() {
  // void rqClient.prefetchInfiniteQuery(modExplorePublicationsQuery);

  return (
    <div className="flex min-h-screen flex-col items-center 2xl:container">
      <HydrationBoundary state={dehydrate(rqClient)}>
        {/* <Posts /> */}
      </HydrationBoundary>
    </div>
  );
}
