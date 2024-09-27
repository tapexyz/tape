"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { getPublication } from "@tape.xyz/generic";
import type { AnyPublication } from "@tape.xyz/lens/gql";
import { notFound, useParams } from "next/navigation";

import { publicationQuery } from "../queries";

export const Publication = () => {
  const { pubId } = useParams<{ pubId: string }>();

  const { data } = useSuspenseQuery(publicationQuery(pubId));

  if (!data.publication) {
    return notFound();
  }

  const publication = getPublication(data.publication as AnyPublication);

  return <div>{publication.id}</div>;
};
