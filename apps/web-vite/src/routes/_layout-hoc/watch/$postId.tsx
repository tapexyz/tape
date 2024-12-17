import { WatchPage } from "@/components/watch/page";
import { commentsQuery } from "@/queries/comment";
import { postQuery } from "@/queries/post";
import { createFileRoute } from "@tanstack/react-router";
import { Spinner } from "@tape.xyz/winder";

export const Route = createFileRoute("/_layout-hoc/watch/$postId")({
  loader: ({ context: { rqClient }, params: { postId } }) => {
    rqClient.ensureQueryData(postQuery(postId));
    return rqClient.ensureInfiniteQueryData(commentsQuery(postId));
  },
  pendingComponent: () => (
    <div className="grid min-h-screen place-items-center">
      <Spinner />
    </div>
  ),
  component: WatchPage
});
