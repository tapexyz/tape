import { useQuery } from "@tanstack/react-query";
import {
  getPublication,
  getPublicationMediaUrl,
  getThumbnailUrl,
  isWatchable
} from "@tape.xyz/generic";
import type { AnyPublication } from "@tape.xyz/lens/gql";
import { VideoPlayer } from "@tape.xyz/winder";
import { useParams, useSearchParams } from "react-router-dom";
import { publicationQuery } from "../queries";
import { TopControls } from "./top";

export const Publication = () => {
  const { pubId } = useParams() as { pubId: string };
  const { data } = useQuery(publicationQuery(pubId));
  const publication = getPublication(data?.publication as AnyPublication);
  const isVideo = isWatchable(publication);

  const [searchParams] = useSearchParams();
  const autoplay = searchParams.get("autoplay");
  const loop = searchParams.get("loop");
  const t = searchParams.get("t") ?? "0";
  const isAutoPlay = Boolean(autoplay) && autoplay === "1";
  const isLoop = Boolean(loop) && loop === "1";
  const currentTime = Number(t);

  if (!isVideo) {
    return <div>not found</div>;
  }

  const src = getPublicationMediaUrl(publication.metadata);
  const poster = getThumbnailUrl(publication.metadata);

  return (
    <div className="size-full h-screen object-fill">
      <VideoPlayer
        src={{ src, type: "video/mp4" }}
        pip={false}
        loop={isLoop}
        poster={poster}
        autoPlay={isAutoPlay}
        currentTime={currentTime}
        top={<TopControls publication={publication} />}
      />
    </div>
  );
};
