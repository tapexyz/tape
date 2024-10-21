import {
  getProfile,
  getProfilePicture,
  getPublicationData,
  getPublicationMediaUrl,
  getThumbnailUrl
} from "@tape.xyz/generic";
import type { PrimaryPublication } from "@tape.xyz/lens/gql";
import {
  Avatar,
  AvatarImage,
  ChatCircleDots,
  Eye,
  Heart,
  VPlayButton,
  VideoPlayer
} from "@tape.xyz/winder";
import { memo } from "react";

type ByteProps = {
  publication: PrimaryPublication;
};

const Stats = () => {
  return (
    <div className="flex items-center space-x-3 px-3 py-2 font-medium text-sm">
      <span className="inline-flex items-center space-x-1">
        <Eye className="size-3" weight="fill" />
        <span>100k</span>
      </span>
      <span className="inline-flex items-center space-x-1">
        <Heart className="size-3" weight="fill" />
        <span>12k</span>
      </span>
      <span className="inline-flex items-center space-x-1">
        <ChatCircleDots className="size-3" weight="fill" />
        <span>4.2k</span>
      </span>
    </div>
  );
};

const Info = memo(({ publication }: ByteProps) => {
  const metadata = getPublicationData(publication.metadata);

  return (
    <div className="flex items-center space-x-2 px-3 pt-2 pb-4">
      <Avatar>
        <AvatarImage src={getProfilePicture(publication.by)} />
      </Avatar>
      <div className="flex flex-col">
        <span className="-mb-0.5 line-clamp-1">{metadata?.title}</span>
        <span className="-mt-0.5 text-sm text-white/40">
          {getProfile(publication.by).displayName}
        </span>
      </div>
    </div>
  );
});

export const Byte = ({ publication }: ByteProps) => {
  const thumbnail = getThumbnailUrl(publication.metadata);
  const videoUrl = getPublicationMediaUrl(publication.metadata);
  return (
    <div className="mb-2.5 overflow-hidden rounded-card bg-black/80 px-1.5 text-white">
      <Stats />
      <VideoPlayer
        aspectRatio="9/16"
        className="rounded-card"
        posterClassName="rounded-card"
        src={{
          src: videoUrl,
          type: "video/mp4"
        }}
        poster={thumbnail}
        load="visible"
        posterLoad="idle"
        autoPlay={false}
        loop={true}
        top={
          <div className="flex justify-end">
            <VPlayButton />
          </div>
        }
      />
      <Info publication={publication} />
    </div>
  );
};
