import { useQuery } from "@tanstack/react-query";
import { getPublication } from "@tape.xyz/generic";
import type { AnyPublication } from "@tape.xyz/lens/gql";
import { useParams } from "react-router-dom";

import { publicationQuery } from "../queries";

export const Publication = () => {
  const { pubId } = useParams() as { pubId: string };
  const { data } = useQuery(publicationQuery(pubId));

  if (!data?.publication) {
    return <div>not found</div>;
  }

  const publication = getPublication(data.publication as AnyPublication);

  return <div>{publication.id}</div>;
};
