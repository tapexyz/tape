import type { Document } from "linkedom/types/interface/document";

import constructIframe from "./constructIframe";

const extractOgTags = async (document: Document) => {
  const titleTag = document.querySelector("title");
  const title = titleTag ? titleTag.textContent || "" : "";

  const descriptionTag = document.querySelector('meta[name="description"]');
  const description = descriptionTag
    ? descriptionTag.getAttribute("content") || ""
    : "";

  const imageTag = document.querySelector('meta[property="og:image"]');
  const image = imageTag ? imageTag.getAttribute("content") || "" : "";

  const urlTag = document.querySelector('meta[property="og:url"]');
  const pageUrl = urlTag
    ? urlTag.getAttribute("content") || "https://tape.xyz"
    : "https://tape.xyz";

  const iframeHTML = await constructIframe(document);

  const metadata: Record<string, unknown> = {
    version: "1.0",
    height: 113,
    width: 200,
    title,
    author_name: title.match(/by\s(.*)\s•/)?.[1] || title,
    author_url: pageUrl,
    description,
    type: iframeHTML ? "video" : "link",
    provider_name: "Tape",
    provider_url: "https://tape.xyz",
    thumbnail_height: 360,
    thumbnail_width: 480,
    thumbnail_url: image
  };

  if (iframeHTML) {
    metadata.html = iframeHTML;
  }

  return metadata;
};

export default extractOgTags;
