"use client";

import { Virtualized } from "@/components/shared/virtualized";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { getPublication, getPublicationMediaUrl } from "@tape.xyz/generic";
import type { AnyPublication } from "@tape.xyz/lens/gql";
import { notFound } from "next/navigation";
import { modExplorePublicationsQuery } from "../queries";

export const Posts = () => {
  const { data, fetchNextPage, isLoading, hasNextPage } =
    useSuspenseInfiniteQuery(modExplorePublicationsQuery);

  const allPublications = data?.pages.flatMap(
    (page) => page.modExplorePublications.items
  ) as AnyPublication[];

  if (!allPublications) {
    return notFound();
  }

  return (
    <div className="w-full max-w-2xl divide-y divide-gray-400 rounded-custom bg-white">
      <Virtualized
        restoreScroll
        data={allPublications}
        endReached={fetchNextPage}
        hasNextPage={hasNextPage}
        itemContent={(_index, anyPublication) => {
          const publication = getPublication(anyPublication);
          const url = getPublicationMediaUrl(publication.metadata);
          return (
            <div className="p-5">
              {publication.metadata.content}
              <video controls className="aspect-video w-full rounded-custom">
                <source src={url} type="video/mp4" />
                <track kind="captions" />
              </video>
            </div>
          );
        }}
      />
    </div>
  );
};
