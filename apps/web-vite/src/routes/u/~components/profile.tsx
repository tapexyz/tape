import { useSuspenseQuery } from "@tanstack/react-query";
import { LENS_NAMESPACE_PREFIX } from "@tape.xyz/constants";
import type { Profile as ProfileType } from "@tape.xyz/lens/gql";
import { Route } from "../$handle";
import { profileQuery } from "./queries";

export const Profile = () => {
  const { handle } = Route.useParams();
  const { data } = useSuspenseQuery(
    profileQuery(`${LENS_NAMESPACE_PREFIX}${handle}`)
  );

  if (!data?.profile) {
    return <div>not found</div>;
  }
  const profile = data.profile as ProfileType;

  return <div>{profile.handle?.fullHandle}</div>;
};
