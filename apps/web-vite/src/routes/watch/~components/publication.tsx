import { useSuspenseQuery } from "@tanstack/react-query";
import { getPublication } from "@tape.xyz/generic";
import type { AnyPublication } from "@tape.xyz/lens/gql";

import { Route } from "../$pubId";
import { publicationQuery } from "./queries";

export const Publication = () => {
  const pubId = Route.useParams().pubId;
  const { data } = useSuspenseQuery(publicationQuery(pubId));

  if (!data.publication) {
    return <div>not found</div>;
  }

  const publication = getPublication(data.publication as AnyPublication);

  return <div>{publication.id}</div>;
};
