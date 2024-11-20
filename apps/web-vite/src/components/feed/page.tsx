import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { getPublication } from "@tape.xyz/generic";
import type { AnyPublication } from "@tape.xyz/indexer";
import { Virtualized } from "../shared/virtualized";
import { Byte } from "./byte";
import { bytesQuery } from "./queries";

export const FeedPage = () => {
  const { data, fetchNextPage, hasNextPage } =
    useSuspenseInfiniteQuery(bytesQuery);

  const allBytes = data.pages.flatMap(
    (page) => page.publications.items
  ) as AnyPublication[];

  return (
    <div className="flex flex-col items-center p-5">
      <div className="min-h-screen w-full max-w-[420px]">
        <Virtualized
          restoreScroll
          data={allBytes}
          endReached={fetchNextPage}
          hasNextPage={hasNextPage}
          itemContent={(_index, anyPublication) => {
            const publication = getPublication(anyPublication);
            return <Byte publication={publication} />;
          }}
        />
      </div>
    </div>
  );
};
