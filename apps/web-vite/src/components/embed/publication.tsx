import { Route } from "@/routes/embed/$pubId";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  getPublication,
  getPublicationMediaUrl,
  getThumbnailUrl,
  isWatchable
} from "@tape.xyz/generic";
import type { AnyPublication } from "@tape.xyz/lens/gql";
import { VideoPlayer } from "@tape.xyz/winder";
import { publicationQuery } from "./queries";
import { TopControls } from "./top";

export const Publication = () => {
  const pubId = Route.useParams().pubId;
  const { data } = useSuspenseQuery(publicationQuery(pubId));
  const publication = getPublication(data.publication as AnyPublication);
  const isVideo = isWatchable(publication);

  const { t, loop, autoplay } = Route.useSearch();

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
        currentTime={t}
        poster={poster}
        loop={loop === 1}
        autoPlay={autoplay === 1}
        top={<TopControls publication={publication} />}
      />
    </div>
  );
};
