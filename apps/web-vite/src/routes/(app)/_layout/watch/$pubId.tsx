import { createFileRoute } from "@tanstack/react-router";
import { WatchPage } from "./~components/page";
import { publicationQuery } from "./~components/queries";

export const Route = createFileRoute("/(app)/_layout/watch/$pubId")({
  loader: ({ context: { rqClient }, params: { pubId } }) => {
    return rqClient.ensureQueryData(publicationQuery(pubId));
  },
  component: WatchPage
});
