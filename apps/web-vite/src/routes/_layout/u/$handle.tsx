import { ProfilePage } from "@/components/u/page";
import { profileQuery } from "@/components/u/queries";
import { createFileRoute } from "@tanstack/react-router";
import { LENS_NAMESPACE_PREFIX } from "@tape.xyz/constants";

export const Route = createFileRoute("/_layout/u/$handle")({
  loader: ({ context: { rqClient }, params: { handle } }) => {
    return rqClient.ensureQueryData(
      profileQuery(`${LENS_NAMESPACE_PREFIX}${handle}`)
    );
  },
  component: ProfilePage
});
