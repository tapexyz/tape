import type { IMAGE_TRANSFORMATIONS } from "@tape.xyz/constants";
import type { Profile } from "@tape.xyz/lens";

import { getLennyPicture } from "./getLennyPicture";
import { imageCdn } from "./image-cdn";
import { sanitizeDStorageUrl } from "./sanitizeDStorageUrl";

export const getProfilePicture = (
  profile: Profile | null,
  type?: keyof typeof IMAGE_TRANSFORMATIONS
): string => {
  if (!profile) {
    return "";
  }
  const url =
    profile.metadata?.picture?.__typename === "ImageSet"
      ? profile.metadata?.picture?.optimized?.uri ||
        profile.metadata?.picture?.raw?.uri
      : profile.metadata?.picture?.__typename === "NftImage"
        ? profile.metadata?.picture.image?.optimized?.uri ||
          profile.metadata?.picture?.image.raw?.uri
        : getLennyPicture(profile?.id);
  const sanitized = sanitizeDStorageUrl(url);
  return imageCdn(sanitized, type);
};

export const getProfilePictureUri = (profile: Profile | null): string => {
  if (!profile) {
    return "";
  }
  const url =
    profile.metadata?.picture?.__typename === "ImageSet"
      ? profile.metadata?.picture?.raw?.uri
      : profile.metadata?.picture?.__typename === "NftImage"
        ? profile?.metadata.picture.image?.raw?.uri
        : null;
  return url;
};
