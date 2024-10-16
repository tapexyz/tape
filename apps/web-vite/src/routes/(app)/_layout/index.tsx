import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "../../~components/home/page";
import { publicationsQuery } from "../../~components/home/queries";

export const Route = createFileRoute("/(app)/_layout/")({
  loader: ({ context: { rqClient } }) => {
    return rqClient.ensureInfiniteQueryData(publicationsQuery);
  },
  component: HomePage
});
