import { FeedPage } from "@/components/feed/page";
import { bytesQuery } from "@/components/feed/queries";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/feed/")({
  loader: ({ context: { rqClient } }) => {
    return rqClient.ensureInfiniteQueryData(bytesQuery);
  },
  component: FeedPage
});
