import { getAccountMetadata, getPostMetadata } from "@/helpers/metadata";
import { TAPE_LOGO, TAPE_WEBSITE_URL } from "@tape.xyz/constants";
import type { Post } from "@tape.xyz/indexer";
import { Avatar, AvatarImage } from "@tape.xyz/winder";

type Props = {
  post: Post;
};

export const TopControls = ({ post }: Props) => {
  const metadata = getPostMetadata(post.metadata);
  const account = post.author;
  const { picture, handle } = getAccountMetadata(account);

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="inline-flex items-center gap-4">
        <a
          href={`${TAPE_WEBSITE_URL}/u/${handle}`}
          target="_blank"
          rel="noreferrer"
        >
          <Avatar>
            <AvatarImage src={picture} />
          </Avatar>
        </a>
        <a
          className="flex flex-col"
          href={`${TAPE_WEBSITE_URL}/watch/${post.id}`}
          target="_blank"
          rel="noreferrer"
        >
          <h1 className="font-medium">{metadata?.title}</h1>
          <span className="text-xs">{handle}</span>
        </a>
      </div>
      <a
        href={`${TAPE_WEBSITE_URL}/watch/${post.id}`}
        target="_blank"
        rel="noreferrer"
      >
        <img src={TAPE_LOGO} alt="tape" className="size-10" />
      </a>
    </div>
  );
};
