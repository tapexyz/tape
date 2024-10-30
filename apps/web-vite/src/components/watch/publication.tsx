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
import { Content } from "./content";
import { CreatorAndComments } from "./creator";
import { publicationQuery } from "./queries";
import { StatsAndActions } from "./stats-and-actions";

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
            autoPlay={true}
            load="visible"
          />
        </div>
        <h1 className="mt-2 mb-4 font-serif text-[38px] leading-[38px]">
          {meta?.title}
        </h1>
        <StatsAndActions />
        <span className="text-muted">Published 2 months ago</span>
        <hr className="my-4 w-full border-custom" />
        <Content content={meta?.content} />
      </div>
      <CreatorAndComments />
    </div>
  );
};
