import { getPostMetadata } from "@/helpers/metadata";
import { usePostSuspenseQuery } from "@/queries/post";
import { Route } from "@/routes/embed/$postId";
import type { Post } from "@tape.xyz/indexer";
import { VideoPlayer } from "@tape.xyz/winder";
import { TopControls } from "./top";

export const PostEmbed = () => {
  const postId = Route.useParams().postId;
  const { data } = usePostSuspenseQuery(postId);

  const post = data?.post as Post;
  const metadata = getPostMetadata(post.metadata);

  const { t, loop, autoplay } = Route.useSearch();

  if (!metadata?.asset.uri) {
    return <div>not found</div>;
  }

  const src = metadata.asset.uri;
  const cover = metadata.asset.cover;

  return (
    <div className="size-full h-screen object-fill">
      <VideoPlayer
        src={{ src, type: "video/mp4" }}
        pip={false}
        currentTime={t}
        poster={cover}
        loop={loop === 1}
        autoPlay={autoplay === 1}
        top={<TopControls post={post} />}
      />
    </div>
  );
};
