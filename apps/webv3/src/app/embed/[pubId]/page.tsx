import "./embed.css";
import { rqClient } from "@/providers/react-query";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { Publication } from "./_components/publication";
import { publicationQuery } from "./queries";

type Props = {
  params: { pubId: string };
};

export default function EmbedPage({ params }: Props) {
  void rqClient.prefetchQuery(publicationQuery(params.pubId));

  return (
    <main>
      <HydrationBoundary state={dehydrate(rqClient)}>
        <Publication />
      </HydrationBoundary>
    </main>
  );
}
