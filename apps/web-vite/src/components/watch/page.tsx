import { getTimeAgo } from "@/helpers/date-time";
import { getPostMetadata } from "@/helpers/metadata";
import { usePostSuspenseQuery } from "@/queries/post";
import { Route } from "@/routes/_layout-hoc/watch/$postId";
import type { Post } from "@tape.xyz/indexer";
import { VideoPlayer } from "@tape.xyz/winder";
import { Content } from "./content";
import { CreatorAndComments } from "./creator";
import { StatsAndActions } from "./stats-and-actions";

export const WatchPage = () => {
  const postId = Route.useParams().postId;
  const { data } = usePostSuspenseQuery(postId);

  const post = data.post as Post;
  const metadata = getPostMetadata(post.metadata);

  const thumbnail = metadata?.asset.cover;
  const videoUrl = metadata?.asset.uri;

  return (
    <div className="flex min-h-screen flex-col rounded-card bg-theme p-5">
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
            {metadata?.title}
          </h1>
          <StatsAndActions />
          <span className="text-muted">
            Published {getTimeAgo(post.timestamp)}
          </span>
          <hr className="my-4 w-full border-custom" />
          <Content content={metadata?.content} />
        </div>
        <CreatorAndComments />
      </div>
    </div>
  );
};
