import { EmbedPage } from "@/components/embed/page";
import { publicationQuery } from "@/components/embed/queries";
import { createFileRoute } from "@tanstack/react-router";

type EmbedSearchParams = {
  t: number;
  loop: number;
  autoplay: number;
};

export const Route = createFileRoute("/embed/$pubId")({
  loader: ({ context: { rqClient }, params: { pubId } }) => {
    return rqClient.ensureQueryData(publicationQuery(pubId));
  },
  validateSearch: (search: Record<string, unknown>): EmbedSearchParams => {
    return {
      t: Number(search.t) || 0,
      loop: Number(search.loop) || 0,
      autoplay: Number(search.autoplay) || 1
    };
  },
  component: EmbedPage
});
