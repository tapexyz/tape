import { LENSTUBE_BYTES_APP_ID } from '@dragverse/constants';
import {
  formatNumber,
  getProfile,
  getProfilePicture,
  getPublicationData
} from '@dragverse/generic';
import type { PrimaryPublication, VideoMetadataV3 } from '@dragverse/lens';
import { HeartOutline } from '@dragverse/ui';
import { getShortHandTime } from '@lib/formatTime';
import Link from 'next/link';
import type { FC } from 'react';

import HoverableProfile from '../HoverableProfile';
import PublicationOptions from '../Publication/PublicationOptions';
import ThumbnailImage from './ThumbnailImage';
import ThumbnailOverlays from './ThumbnailOverlays';

type Props = {
  video: PrimaryPublication
}

const VideoCard: FC<Props> = ({ video }) => {
  const isBytes = video.publishedOn?.id === LENSTUBE_BYTES_APP_ID

  const href = isBytes ? `/bytes/${video.id}` : `/watch/${video.id}`
  const metadata = video.metadata as VideoMetadataV3

  return (
    <div className="group">
      <Link href={href}>
        <div className="rounded-medium tape-border relative aspect-[16/9] overflow-hidden">
          <ThumbnailImage video={video} />
          <ThumbnailOverlays video={video} />
        </div>
      </Link>
      <div className="py-2">
        <div className="flex gap-2">
          <img
            src={getProfilePicture(video.by, 'AVATAR')}
            className="size-8 rounded-full"
            alt={getProfile(video.by)?.displayName}
            draggable={false}
          />

          <div className="flex w-full flex-col justify-between gap-1">
            <div className="flex w-full min-w-0 items-start justify-between space-x-1.5">
              <Link className="line-clamp-2 break-words font-bold" href={href}>
                {getPublicationData(metadata)?.title}
              </Link>
              <div className="flex pr-1 pt-1">
                <PublicationOptions publication={video} />
              </div>
            </div>

            <div className="flex items-center text-xs">
              <HoverableProfile profile={video.by} />
              <span className="middot" />
              <div className="flex items-center gap-1">
                <HeartOutline className="size-3" />
                {formatNumber(video.stats?.reactions)}
              </div>
              <span className="middot" />
              <span>{getShortHandTime(video.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoCard
