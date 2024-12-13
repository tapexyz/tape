import { usePostSuspenseQuery } from "@/queries/post";
import { Route } from "@/routes/_layout/watch/$postId";
import { useNavigate } from "@tanstack/react-router";
import { WORKER_AVATAR_URL } from "@tape.xyz/constants";
import type { Post } from "@tape.xyz/indexer";
import {
  Avatar,
  AvatarImage,
  Button,
  DotsThreeVertical
} from "@tape.xyz/winder";

export const Account = () => {
  const postId = Route.useParams().postId;
  const navigate = useNavigate();

  const { data } = usePostSuspenseQuery(postId);
  const post = data.post as Post;
  const account = post.author;
  const metadata = account.metadata;

  if (!metadata) {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-card border border-custom bg-[#F7F7F7] dark:bg-[#202020]">
      <div className="relative">
        <img
          src={metadata.coverPicture}
          className="-z-10 h-24 w-full object-cover"
          alt="cover"
          draggable={false}
        />
        <div className="absolute bottom-0 h-10 w-full bg-gradient-to-t from-[#F7F7F7] dark:from-[#202020]" />
      </div>
      <div className="-mt-10 relative z-10 flex flex-col items-center space-y-4 px-5">
        <div className="rounded-xl bg-theme p-1">
          <Avatar size="2xl">
            <AvatarImage src={metadata.picture} />
          </Avatar>
        </div>
        <div className="space-y-1.5">
          <h1 className="text-center font-serif text-[28px] leading-[28px]">
            {account.username?.localName}
          </h1>
          <div className="flex items-center justify-center space-x-2 text-sm">
            <p>
              14k <span className="text-muted">followers</span>
            </p>
            <p>
              72 <span className="text-muted">videos</span>
            </p>
          </div>
        </div>
        <div className="flex space-x-1.5">
          <Button>
            <span>Follow</span>
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              navigate({
                to: "/u/$handle",
                params: { handle: account.username?.localName as string },
                search: { media: "videos" }
              })
            }
          >
            View profile
          </Button>
          <Button variant="secondary" size="icon">
            <DotsThreeVertical className="size-5" weight="bold" />
          </Button>
        </div>
        <p className="line-clamp-2 px-5 text-center text-primary/60 text-sm">
          {metadata.bio}
        </p>
        <span className="-space-x-1.5 flex rounded-full bg-primary/10 p-1">
          {[100000, 6000, 3090, 4000, 5600].map((item) => (
            <Avatar size="xs" shape="circle" key={item}>
              <AvatarImage src={`${WORKER_AVATAR_URL}/${item}`} />
            </Avatar>
          ))}
        </span>
        <div className="w-full">
          <hr className="my-2 w-full border-custom" />
          <div>WIP</div>
        </div>
      </div>
    </div>
  );
};
