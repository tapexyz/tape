import { ProfilePage } from "@/components/u/page";
import { accountQuery } from "@/queries/account";
import { createFileRoute } from "@tanstack/react-router";
import { Spinner } from "@tape.xyz/winder";

const media = ["videos", "bytes"] as const;

type ProfileSearchParams = {
  media: (typeof media)[number];
};

export const Route = createFileRoute("/_layout/u/$handle")({
  loader: ({ context: { rqClient }, params: { handle } }) => {
    return rqClient.ensureQueryData(accountQuery(handle));
  },
  validateSearch: (search: Record<string, unknown>): ProfileSearchParams => {
    return {
      media: media.includes(search.media as ProfileSearchParams["media"])
        ? (search.media as ProfileSearchParams["media"])
        : "videos"
    };
  },
  pendingComponent: () => (
    <div className="grid min-h-screen place-items-center">
      <Spinner />
    </div>
  ),
  component: ProfilePage
});
