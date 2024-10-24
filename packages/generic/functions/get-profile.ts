import { LENS_NAMESPACE_PREFIX } from "@tape.xyz/constants";
import type { Profile } from "@tape.xyz/lens";

type ReturnType = {
  link: string;
  param: string;
  slug: string;
  address: string;
  displayName: string;
  slugWithPrefix: string;
};

export const getProfile = (profile: Profile | null): ReturnType => {
  if (!profile) {
    return {
      link: "",
      slug: "",
      param: "",
      address: "",
      displayName: "",
      slugWithPrefix: ""
    };
  }

  const prefix = profile.handle ? "@" : "#";
  let slug: string = profile.handle?.fullHandle || profile.id;
  slug = slug.replace(LENS_NAMESPACE_PREFIX, "");

  return {
    slug,
    slugWithPrefix: `${prefix}${slug}`,
    displayName: profile.metadata?.displayName || slug,
    param: profile.handle ? slug : `~${profile.id}`,
    link: profile.handle
      ? `/u/${profile.handle.localName}`
      : `/profile/${profile.id}`,
    address: profile.ownedBy?.address
  };
};
