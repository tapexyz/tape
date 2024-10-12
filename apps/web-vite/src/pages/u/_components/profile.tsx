import { useQuery } from "@tanstack/react-query";
import { LENS_NAMESPACE_PREFIX } from "@tape.xyz/constants";
import type { Profile as ProfileType } from "@tape.xyz/lens/gql";

import { useParams } from "react-router-dom";
import { profileQuery } from "../queries";

export const Profile = () => {
  const { handle } = useParams() as { handle: string };
  const { data } = useQuery(profileQuery(`${LENS_NAMESPACE_PREFIX}${handle}`));

  if (!data?.profile) {
    return <div>not found</div>;
  }
  const profile = data.profile as ProfileType;

  return <div>{profile.handle?.fullHandle}</div>;
};
