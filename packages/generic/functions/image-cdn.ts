import {
  IMAGEKIT_URL,
  IMAGE_TRANSFORMATIONS,
  IS_PRODUCTION
} from "@tape.xyz/constants";

export const imageCdn = (
  url: string,
  type?: keyof typeof IMAGE_TRANSFORMATIONS
): string => {
  if (!url) {
    return url;
  }

  return IS_PRODUCTION
    ? type
      ? `${IMAGEKIT_URL}/${IMAGE_TRANSFORMATIONS[type]}/${url}`
      : `${IMAGEKIT_URL}/${url}`
    : url;
};
