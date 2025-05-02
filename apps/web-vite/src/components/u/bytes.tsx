import { useAccountBytesQuery } from "@/queries/post";
import { INFINITE_SCROLL_ROOT_MARGIN } from "@tape.xyz/constants";
import type { Post } from "@tape.xyz/indexer";
import { Spinner } from "@tape.xyz/winder";
import { useInView } from "react-cool-inview";
import { ByteCard } from "../shared/byte-card";

interface BytesProps {
  address: string;
}

export const Bytes = ({ address }: BytesProps) => {
  const { data, isLoading, fetchNextPage, hasNextPage } =
    useAccountBytesQuery(address);
  const bytes = data?.pages
    .flatMap((page) => page?.posts?.items)
    .filter(Boolean) as Post[];

  const { observe } = useInView({
    rootMargin: INFINITE_SCROLL_ROOT_MARGIN,
    onEnter: async () => {
      await fetchNextPage();
    }
  });

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-x-2 gap-y-5 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
        {bytes?.map((byte) => (
          <ByteCard key={byte.slug} byte={byte} />
        ))}
      </div>
      {hasNextPage && (
        <span ref={observe} className="flex justify-center p-10">
          <Spinner />
        </span>
      )}
    </>
  );
};
