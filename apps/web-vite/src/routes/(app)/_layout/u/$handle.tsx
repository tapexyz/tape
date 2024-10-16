import { createFileRoute } from "@tanstack/react-router";
import { LENS_NAMESPACE_PREFIX } from "@tape.xyz/constants";
import { ProfilePage } from "./~components/page";
import { profileQuery } from "./~components/queries";

export const Route = createFileRoute("/(app)/_layout/u/$handle")({
  loader: ({ context: { rqClient }, params: { handle } }) => {
    return rqClient.ensureQueryData(
      profileQuery(`${LENS_NAMESPACE_PREFIX}${handle}`)
    );
  },
  component: ProfilePage
});
