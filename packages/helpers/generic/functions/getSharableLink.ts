import {
  HEY_WEBSITE_URL,
  TAPE_APP_NAME,
  TAPE_WEBSITE_URL,
  TAPE_X_HANDLE,
} from "@tape.xyz/constants";
import type { MirrorablePublication } from "@tape.xyz/lens";

import { getPublicationData } from "./getPublicationData";

type Link = "tape" | "hey" | "x" | "reddit" | "linkedin";

export const getSharableLink = (
  link: Link,
  publication: MirrorablePublication,
) => {
  const fullHandle = publication.by.handle?.fullHandle;
  const { metadata } = publication;

  const url = `${TAPE_WEBSITE_URL}/watch/${publication.id}`;

  if (link === "tape") {
    return `${TAPE_WEBSITE_URL}/watch/${publication.id}`;
  }
  if (link === "hey") {
    return `${HEY_WEBSITE_URL}/?url=${url}&text=${
      (getPublicationData(metadata)?.title as string) ?? ""
    } by @${fullHandle}&hashtags=${TAPE_APP_NAME}&preview=true`;
  }
  if (link === "x") {
    return encodeURI(
      `https://x.com/intent/tweet?url=${url}&text=${
        (getPublicationData(metadata)?.title as string) ?? ""
      } by @${fullHandle}&via=${TAPE_X_HANDLE}&related=${TAPE_APP_NAME}&hashtags=${TAPE_APP_NAME}`,
    );
  }
  if (link === "reddit") {
    return `https://www.reddit.com/submit?url=${url}&title=${
      (getPublicationData(metadata)?.title as string) ?? ""
    } by @${fullHandle}`;
  }
  if (link === "linkedin") {
    return `https://www.linkedin.com/shareArticle/?url=${url} by @${fullHandle}&title=${
      (getPublicationData(metadata)?.title as string) ?? ""
    }&summary=${
      getPublicationData(metadata)?.content as string
    }&source=${TAPE_APP_NAME}`;
  }
  return "";
};
