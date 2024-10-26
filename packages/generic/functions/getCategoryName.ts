import { TAPE_MEDIA_CATEGORIES } from "@tape.xyz/constants";

export const getCategoryName = (tag: string) => {
  if (!tag) {
    return null;
  }
  return TAPE_MEDIA_CATEGORIES.find((c) => c.tag === tag)?.name;
};

export const getCategoryByTag = (tag: string) => {
  return TAPE_MEDIA_CATEGORIES.find(
    (c) => c.tag === tag
  ) as (typeof TAPE_MEDIA_CATEGORIES)[0];
};
