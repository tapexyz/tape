import { Virtualized } from "@/components/shared/virtualized";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { getPublication } from "@tape.xyz/generic";
import type { AnyPublication } from "@tape.xyz/lens/gql";
import { publicationsQuery } from "./queries";

export const Feed = () => {
  const { data, fetchNextPage, hasNextPage } =
    useSuspenseInfiniteQuery(publicationsQuery);

  const allPublications = data.pages.flatMap(
    (page) => page.publications.items
  ) as AnyPublication[];

  return (
    <div className="w-full">
      <div className="divide-y divide-gray-400">
        <Virtualized
          restoreScroll
          data={allPublications}
          endReached={fetchNextPage}
          hasNextPage={hasNextPage}
          itemContent={(_index, anyPublication) => {
            const publication = getPublication(anyPublication);
            return (
              <div className="py-5">
                <Link to={`/watch/${publication.id}`}>
                  {publication.metadata.content}
                </Link>
              </div>
            );
          }}
        />
      </div>
    </div>
  );
};
