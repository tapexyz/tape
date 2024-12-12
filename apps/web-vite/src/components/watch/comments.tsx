import { getPostMetadata } from "@/helpers/metadata";
import { commentsQuery } from "@/queries/comment";
import { Route } from "@/routes/_layout/watch/$postId";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import type { Post } from "@tape.xyz/indexer";
import {
  Avatar,
  AvatarImage,
  Button,
  CaretRight,
  EmptyState,
  Heart,
  Plus
} from "@tape.xyz/winder";
import { memo } from "react";

const Comment = ({ comment }: { comment: Post }) => {
  const account = comment.author;
  const metadata = getPostMetadata(comment.metadata);

  return (
    <div>
      <hr className="my-4 w-full border-custom" />
      <div className="flex space-x-1.5">
        <Avatar size="md">
          <AvatarImage src={account.metadata?.picture} />
        </Avatar>
        <div className="space-y-1 text-sm">
          <div className="truncate font-semibold">
            {account.username?.localName}
          </div>
          <p>{metadata?.content}</p>
          <div className="flex space-x-1.5 pt-2">
            <Button variant="secondary" size="xs">
              <span className="inline-flex items-center space-x-1">
                <Heart weight="bold" />
                <span>74</span>
              </span>
            </Button>
            <Button variant="secondary" size="xs">
              Reply
            </Button>
            <span className="inline-flex items-center space-x-0.5 pl-1.5">
              <span className="text-muted">7 replies</span>
              <CaretRight className="size-3" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Comments = memo(() => {
  const postId = Route.useParams().postId;
  const { data } = useSuspenseInfiniteQuery(commentsQuery(postId));

  const comments = data.pages.flatMap(
    (page) => page.postReferences.items
  ) as Post[];

  return (
    <div className="overflow-hidden rounded-card border border-custom bg-[#F7F7F7] px-5 py-4 dark:bg-[#202020]">
      <div className="flex justify-between">
        <p>Comments</p>
        <Button variant="secondary" size="xs">
          <span className="inline-flex items-center space-x-1">
            <span>Write</span>
            <Plus weight="bold" />
          </span>
        </Button>
      </div>

      {comments.length === 0 && (
        <EmptyState
          title="No comments, yet!"
          description="Be the first to share your thoughts."
          className="my-6"
        />
      )}

      {comments.map((comment) => {
        return <Comment comment={comment} key={comment.id} />;
      })}
    </div>
  );
});
