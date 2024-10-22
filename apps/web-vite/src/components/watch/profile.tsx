import { Route } from "@/routes/_layout/watch/$pubId";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getProfile, getPublication } from "@tape.xyz/generic";
import type { AnyPublication } from "@tape.xyz/lens/gql";
import { publicationQuery } from "./queries";

export const Profile = () => {
  const pubId = Route.useParams().pubId;
  const { data } = useSuspenseQuery(publicationQuery(pubId));
  const publication = getPublication(data.publication as AnyPublication);

  const profile = publication.by;
  const meta = getProfile(profile);

  return <div>{meta.displayName}</div>;
};
