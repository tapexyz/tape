import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import {
  getProfile,
  getPublication,
  getPublicationData,
  getThumbnailUrl,
} from "@tape.xyz/generic";
import type { AnyPublication } from "@tape.xyz/lens";
import type { Metadata } from "next";

import { rqClient } from "@/app/providers/react-query";

import { Comments } from "./_components/comments";
import { Publication } from "./_components/publication";
import { publicationQuery } from "./queries";

type Props = {
  params: { pubId: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await rqClient.fetchQuery(publicationQuery(params.pubId));

  if (!data.publication) {
    return {};
  }

  const publication = getPublication(data.publication as AnyPublication);
  const metadata = getPublicationData(getPublication(publication).metadata);
  const poster = getThumbnailUrl(publication.metadata, true);

  return {
    title:
      metadata?.title || `${getProfile(publication.by).displayName} on Tape`,
    description: metadata?.content,
    openGraph: {
      images: [poster],
    },
  };
}

export function generateStaticParams() {
  return [{ handle: "titannode", pubId: "0x0164ad-0x01ed" }];
}

export default function WatchPage({ params }: Props) {
  void rqClient.prefetchQuery(publicationQuery(params.pubId));

  return (
    <div className="flex min-h-screen flex-col items-center p-24">
      <HydrationBoundary state={dehydrate(rqClient)}>
        <Publication />
      </HydrationBoundary>
      <Comments />
    </div>
  );
}
