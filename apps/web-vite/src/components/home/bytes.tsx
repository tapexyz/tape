import { useBytesQuery } from "@/queries/post";
import type { Post } from "@tape.xyz/indexer";
import { ByteCard } from "../shared/byte-card";

export const Bytes = () => {
  const { data, error } = useBytesQuery();

  const bytes = data?.pages
    .flatMap((page) => page?.posts?.items)
    .filter(Boolean) as Post[];

  if (!bytes?.length || error) {
    return null;
  }

  return bytes.map((byte) => {
    return <ByteCard key={byte.id} byte={byte} className="aspect-[9/16]" />;
  });
};
