import { STATIC_ASSETS } from "@utils/constants";
import { LenstubePublication } from "src/types/local";

const getThumbnailUrl = (video: LenstubePublication): string => {
  return (
    video.metadata.cover?.original.url ??
    `${STATIC_ASSETS}/images/fallbackThumbnail.png`
  );
};

export default getThumbnailUrl;
