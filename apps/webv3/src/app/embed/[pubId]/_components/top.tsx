import { TAPE_LOGO, TAPE_WEBSITE_URL } from "@tape.xyz/constants";
import {
  getProfile,
  getProfilePicture,
  getPublicationData
} from "@tape.xyz/generic";
import type { PrimaryPublication } from "@tape.xyz/lens/gql";
import { Avatar, AvatarImage } from "@tape.xyz/winder";
import Link from "next/link";

type Props = {
  publication: PrimaryPublication;
};

export const TopControls = ({ publication }: Props) => {
  const metadata = getPublicationData(publication.metadata);

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="inline-flex items-center gap-4">
        <Link
          href={`${TAPE_WEBSITE_URL}${getProfile(publication.by)?.link}`}
          target="_blank"
          prefetch={false}
        >
          <Avatar>
            <AvatarImage src={getProfilePicture(publication.by)} />
          </Avatar>
        </Link>
        <Link
          className="flex flex-col"
          href={`${TAPE_WEBSITE_URL}/watch/${publication.id}`}
          target="_blank"
          prefetch={false}
        >
          <h1 className="font-medium">{metadata?.title}</h1>
          <span className="text-xs">
            {getProfile(publication.by)?.slugWithPrefix}
          </span>
        </Link>
      </div>
      <Link
        href={`${TAPE_WEBSITE_URL}/watch/${publication.id}`}
        target="_blank"
        prefetch={false}
      >
        <img src={TAPE_LOGO} alt="tape" className="size-10" />
      </Link>
    </div>
  );
};
