import { WatchPage } from "@/components/watch/page";
import { publicationQuery } from "@/components/watch/queries";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/watch/$pubId")({
  loader: ({ context: { rqClient }, params: { pubId } }) => {
    return rqClient.ensureQueryData(publicationQuery(pubId));
  },
  component: WatchPage
});
