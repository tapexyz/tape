import HoverableProfile from '@components/Common/HoverableProfile';
import {
  getProfile,
  getProfilePicture,
  getPublicationData
} from '@dragverse/generic';
import type { MentionNotification } from '@dragverse/lens';
import { MentionOutline } from '@dragverse/ui';
import { getShortHandTime } from '@lib/formatTime';
import Link from 'next/link';
import type { FC } from 'react';

type Props = {
  notification: MentionNotification
}

const Mentioned: FC<Props> = ({ notification: { publication } }) => {
  const videoId =
    publication.__typename === 'Comment' ? publication.root.id : publication.id
  return (
    <div className="flex justify-between">
      <span className="flex space-x-4">
        <div className="p-1">
          <MentionOutline className="size-5" />
        </div>
        <div>
          <span className="flex -space-x-1.5">
            <HoverableProfile profile={publication.by} key={publication.by?.id}>
              <img
                className="size-7 rounded-full border dark:border-gray-700/80"
                src={getProfilePicture(publication.by, 'AVATAR')}
                draggable={false}
                alt={getProfile(publication.by)?.displayName}
              />
            </HoverableProfile>
          </span>
          <div className="py-2">mentioned you</div>
          <Link
            href={`/watch/${videoId}`}
            className="text-dust line-clamp-2 font-medium"
          >
            {getPublicationData(publication.metadata)?.content}
          </Link>
        </div>
      </span>
      <span className="text-dust text-sm">
        {getShortHandTime(publication.createdAt)}
      </span>
    </div>
  )
}

export default Mentioned
