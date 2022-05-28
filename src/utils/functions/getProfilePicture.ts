/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Profile } from "src/types";

import { getRandomProfilePicture } from "./getRandomProfilePicture";

const getProfilePicture = (channel: Profile): string => {
  return (
    // @ts-ignore
    channel?.picture?.original?.url ??
    // @ts-ignore
    channel?.picture?.uri ??
    getRandomProfilePicture(channel?.handle)
  );
};

export default getProfilePicture;
