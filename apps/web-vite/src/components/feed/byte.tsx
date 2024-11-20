import {
  getProfile,
  getProfilePicture,
  getPublicationData,
  getPublicationMediaUrl,
  getThumbnailUrl
} from "@tape.xyz/generic";
import type { PrimaryPublication } from "@tape.xyz/indexer";
import {
  Avatar,
  AvatarImage,
  Button,
  ChatCircleDots,
  DotsThreeVertical,
  Eye,
  Heart,
  Lightning,
  SpeakerHigh,
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

const Actions = () => {
  return (
    <div className="-right-16 absolute inset-y-0 z-10 flex flex-col justify-center">
      <div className="my-2 space-y-2 rounded-card-sm bg-black/80 p-2">
        <Button
          variant="secondary"
          className="bg-white/10 text-white/60"
          size="icon"
        >
          <Heart className="size-5" weight="bold" />
        </Button>
        <Button
          variant="secondary"
          className="bg-white/10 text-white/60"
          size="icon"
        >
          <ChatCircleDots className="size-5" weight="bold" />
        </Button>
        <Button
          variant="secondary"
          className="bg-white/10 text-white/60"
          size="icon"
        >
          <Lightning className="size-5" weight="bold" />
        </Button>
        <Button
          variant="secondary"
          className="bg-white/10 text-white/60"
          size="icon"
        >
          <SpeakerHigh className="size-5" weight="bold" />
        </Button>
      </div>
      <div className="space-y-2 rounded-card-sm bg-black/80 p-2">
        <Button
          variant="secondary"
          className="bg-white/10 text-white/60"
          size="icon"
        >
          <DotsThreeVertical className="size-5" weight="bold" />
        </Button>
      </div>
    </div>
  );
};

export const Byte = ({ publication }: ByteProps) => {
  const thumbnail = getThumbnailUrl(publication.metadata);
  const videoUrl = getPublicationMediaUrl(publication.metadata);
  return (
    <div className="relative mb-2.5 rounded-card bg-black/80 px-1.5 text-white">
      <Stats />
      <VideoPlayer
        aspectRatio="9/16"
        className="rounded-card"
        posterClassName="rounded-card"
        src={{ src: videoUrl, type: "video/mp4" }}
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
      <Actions />
    </div>
  );
};
