import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { FALLBACK_THUMBNAIL_URL } from "@tape.xyz/constants";
import {
  getPublicationData,
  getThumbnailUrl,
  imageCdn
} from "@tape.xyz/generic";
import type { PrimaryPublication } from "@tape.xyz/lens";
import { curatedBytesQuery } from "./queries";

export const Bytes = () => {
  const { data, error } = useQuery(curatedBytesQuery);

  const bytes = data?.publications?.items as PrimaryPublication[];

  if (!bytes?.length || error) {
    return null;
  }

  return bytes.map((byte) => {
    return (
      <Link
        key={byte.id}
        href="/"
        className="relative aspect-[9/16] h-[350px] flex-none shrink-0 overflow-hidden rounded-card"
      >
        <img
          className="aspect-[9/16] h-full object-cover"
          src={imageCdn(getThumbnailUrl(byte.metadata))}
          alt="thumbnail"
          height={1000}
          width={600}
          draggable={false}
          onError={({ currentTarget }) => {
            currentTarget.src = FALLBACK_THUMBNAIL_URL;
          }}
        />
        <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-b from-transparent to-black px-4 py-2">
          <h1 className="line-clamp-1 break-all text-white">
            {getPublicationData(byte.metadata)?.title}
          </h1>
        </div>
      </Link>
    );
  });
};
