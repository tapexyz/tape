import { WatchPage } from "@/components/watch/page";
import { commentsQuery, publicationQuery } from "@/components/watch/queries";
import { createFileRoute } from "@tanstack/react-router";
import { Spinner } from "@tape.xyz/winder";

export const Route = createFileRoute("/_layout/watch/$pubId")({
  loader: ({ context: { rqClient }, params: { pubId } }) => {
    rqClient.ensureQueryData(publicationQuery(pubId));
    return rqClient.ensureInfiniteQueryData(commentsQuery(pubId));
  },
  pendingComponent: () => (
    <div className="grid min-h-screen place-items-center">
      <Spinner />
    </div>
  ),
  component: WatchPage
});
