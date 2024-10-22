import type { ProfileMetadata } from "@tape.xyz/lens";

export const getProfileCoverPicture = (
  metadata: ProfileMetadata,
  withFallback = false
): string => {
  return metadata?.coverPicture?.optimized?.uri
    ? metadata.coverPicture.optimized.uri
    : withFallback
      ? "ipfs://bafkreihn5v4hpuxgcysnpb4pgcerkmhwddxq65qswmit6j4nj44btyzdou" //`${STATIC_ASSETS}/images/fallback-cover.svg`
      : null;
};
