import { EmbedPage } from "@/components/embed/page";
import { postQuery } from "@/queries/post";
import { createFileRoute } from "@tanstack/react-router";

type EmbedSearchParams = {
  t: number;
  loop: number;
  autoplay: number;
};

export const Route = createFileRoute("/embed/$postId")({
  loader: ({ context: { rqClient }, params: { postId } }) => {
    return rqClient.ensureQueryData(postQuery(postId));
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
