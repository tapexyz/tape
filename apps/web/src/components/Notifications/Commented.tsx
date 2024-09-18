import {
  getLennyPicture,
  getProfile,
  getProfilePicture,
  getPublicationData
} from "@tape.xyz/generic";
import type { CommentNotification } from "@tape.xyz/lens";
import { CommentOutline } from "@tape.xyz/ui";
import Link from "next/link";
import type { FC } from "react";

import HoverableProfile from "@/components/Common/HoverableProfile";
import { getShortHandTime } from "@/lib/formatTime";

type Props = {
  notification: CommentNotification;
};

const Commented: FC<Props> = ({ notification: { comment } }) => {
  return (
    <div className="flex justify-between">
      <span className="flex space-x-4">
        <div className="p-1">
          <CommentOutline className="size-5" />
        </div>
        <div>
          <span className="-space-x-1.5 flex">
            <HoverableProfile profile={comment.by} key={comment.by?.id}>
              <img
                className="size-7 rounded-full border dark:border-gray-700/80"
                src={getProfilePicture(comment.by, "AVATAR")}
                draggable={false}
                alt={getProfile(comment.by)?.slug}
                onError={({ currentTarget }) => {
                  currentTarget.src = getLennyPicture(comment.by?.id);
                }}
              />
            </HoverableProfile>
          </span>
          <div className="py-2">commented on your publication</div>
          <Link
            href={`/watch/${comment.root.id}`}
            className="line-clamp-2 font-medium text-dust"
          >
            {getPublicationData(comment.metadata)?.content}
          </Link>
        </div>
      </span>
      <span className="text-dust text-sm">
        {getShortHandTime(comment.createdAt)}
      </span>
    </div>
  );
};

export default Commented;
