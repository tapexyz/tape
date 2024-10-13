import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "./~components/home/page";
import { publicationsQuery } from "./~components/home/queries";

export const Route = createFileRoute("/")({
  loader: ({ context: { rqClient } }) => {
    return rqClient.ensureInfiniteQueryData(publicationsQuery);
  },
  pendingComponent: () => <div>Loading...</div>,
  component: HomePage
});
