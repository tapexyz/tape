import { Route } from "@/routes/_layout/watch/$pubId";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  getPublication,
  getPublicationData,
  getPublicationMediaUrl,
  getThumbnailUrl
} from "@tape.xyz/generic";
import type { AnyPublication } from "@tape.xyz/lens/gql";
import { VideoPlayer } from "@tape.xyz/winder";
import { Actions } from "./actions";
import { Comments } from "./comments";
import { Profile } from "./profile";
import { publicationQuery } from "./queries";
import { Stats } from "./stats";

export const Publication = () => {
  const pubId = Route.useParams().pubId;
  const { data } = useSuspenseQuery(publicationQuery(pubId));

  const publication = getPublication(data.publication as AnyPublication);
  const thumbnail = getThumbnailUrl(publication.metadata, true);
  const videoUrl = getPublicationMediaUrl(publication.metadata);
  const meta = getPublicationData(publication.metadata);

  return (
    <div className="gap-4 md:flex">
      <div className="w-full md:w-3/4">
        <div>
          <VideoPlayer
            className="rounded-card-sm"
            posterClassName="rounded-card-sm"
            src={{ src: videoUrl, type: "video/mp4" }}
            poster={thumbnail}
            load="visible"
            autoPlay={false}
          />
        </div>
        <h1 className="my-2 font-serif text-[38px] leading-[38px]">
          {meta?.title}
        </h1>
        <div className="flex flex-wrap items-center justify-between gap-5">
          <Stats />
          <Actions />
        </div>
      </div>
      <div className="flex-1 space-y-5">
        <Profile />
        <Comments />
      </div>
    </div>
  );
};
