import {
  IMAGE_TRANSFORMATIONS,
  IS_PRODUCTION,
  LENS_IMAGEKIT_SNAPSHOT_URL
} from "@tape.xyz/constants";

export const imageCdn = (
  url: string,
  type?: keyof typeof IMAGE_TRANSFORMATIONS
): string => {
  if (!url) {
    return url;
  }

  return type && IS_PRODUCTION
    ? `${LENS_IMAGEKIT_SNAPSHOT_URL}/${IMAGE_TRANSFORMATIONS[type]}/${url}`
    : url;
};
