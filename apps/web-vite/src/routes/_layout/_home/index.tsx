import { HomePage } from "@/components/home/page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/_home/")({
  // loader: ({ context: { rqClient } }) => {
  //   return rqClient.ensureInfiniteQueryData(publicationsQuery);
  // },
  component: HomePage
});
