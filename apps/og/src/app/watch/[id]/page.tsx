import {
  OG_IMAGE,
  TAPE_APP_NAME,
  TAPE_EMBED_URL,
  TAPE_WEBSITE_URL,
  TAPE_X_HANDLE,
  WORKER_OEMBED_URL
} from "@tape.xyz/constants";
import {
  getProfile,
  getPublication,
  getPublicationData,
  truncate
} from "@tape.xyz/generic";
import type { AnyPublication } from "@tape.xyz/lens";
import { PublicationDocument } from "@tape.xyz/lens";
import { apolloClient } from "@tape.xyz/lens/apollo";
import type { Metadata } from "next";

import common from "@/common";
import { getCollectModuleMetadata } from "@/other-metadata";

type Props = {
  params: Promise<{ id: string }>;
};

const client = apolloClient();

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { data } = await client.query({
    query: PublicationDocument,
    variables: { request: { forId: id } }
  });

  if (!data.publication) {
    return common;
  }

  const publication = data.publication as AnyPublication;
  const targetPublication = getPublication(publication);
  const { by: profile, metadata, isHidden } = targetPublication;

  if (isHidden) {
    return common;
  }

  const publicationTitle = getPublicationData(metadata)?.title || "";
  const publicationContent = truncate(
    getPublicationData(metadata)?.content || "",
    200
  );
  const publicationCover =
    getPublicationData(metadata)?.asset?.cover || OG_IMAGE;
  const duration = getPublicationData(metadata)?.asset?.duration;

  const title = `${publicationTitle} by ${
    getProfile(profile).slugWithPrefix
  } • ${TAPE_APP_NAME}`;
  const embedUrl = `${TAPE_EMBED_URL}/${targetPublication.id}`;
  const pageUrl = new URL(`${TAPE_WEBSITE_URL}/watch/${targetPublication.id}`);

  return {
    title,
    applicationName: TAPE_APP_NAME,
    description: publicationContent,
    metadataBase: pageUrl,
    openGraph: {
      title,
      description: publicationContent,
      type: "video.episode",
      images: [publicationCover],
      siteName: TAPE_APP_NAME,
      videos: [embedUrl],
      duration,
      url: pageUrl,
      tags: [
        ...(Array.isArray(metadata.tags) ? metadata.tags : []),
        "tape",
        "video",
        "episode",
        "watch",
        title,
        getProfile(profile).displayName
      ],
      releaseDate: targetPublication.createdAt
    },
    twitter: {
      title,
      description: publicationContent,
      card: "player",
      images: [publicationCover],
      site: `@${TAPE_X_HANDLE}`,
      players: {
        playerUrl: embedUrl,
        streamUrl: embedUrl,
        height: 720,
        width: 1280
      }
    },
    other: {
      ...getCollectModuleMetadata(targetPublication)
    },
    alternates: {
      canonical: pageUrl,
      types: {
        "application/json+oembed": `${WORKER_OEMBED_URL}?url=${pageUrl}&format=json`,
        "text/xml+oembed": `${WORKER_OEMBED_URL}?url=${pageUrl}&format=xml`,
        title: publicationTitle
      }
    }
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <div>{id}</div>;
}
