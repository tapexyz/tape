import Tooltip from '@components/UIElements/Tooltip'
import { STATIC_ASSETS } from '@utils/constants'
import { getTimeFromSeconds } from '@utils/functions/formatTime'
import { getValueFromTraitType } from '@utils/functions/getFromAttributes'
import { getIsSensitiveContent } from '@utils/functions/getIsSensitiveContent'
import getProfilePicture from '@utils/functions/getProfilePicture'
import getThumbnailUrl from '@utils/functions/getThumbnailUrl'
import imageCdn from '@utils/functions/imageCdn'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Link from 'next/link'
import React, { FC } from 'react'
import { MdPublishedWithChanges } from 'react-icons/md'
import { Attribute } from 'src/types'
import { LenstubePublication } from 'src/types/local'
dayjs.extend(relativeTime)

type Props = {
  video: LenstubePublication
}

const MirroredVideoCard: FC<Props> = ({ video }) => {
  const mirrorOf = video.mirrorOf as LenstubePublication
  const isSensitiveContent = getIsSensitiveContent(
    mirrorOf.metadata?.attributes,
    video.id
  )
  const videoDuration = getValueFromTraitType(
    mirrorOf.metadata?.attributes as Attribute[],
    'durationInSeconds'
  )

  return (
    <div className="overflow-hidden group bg-gray-50 rounded-xl dark:bg-[#181818]">
      <Link href={`/watch/${mirrorOf.id}`}>
        <a>
          <div className="relative rounded-t-xl aspect-w-16 aspect-h-8">
            <img
              src={imageCdn(
                isSensitiveContent
                  ? `${STATIC_ASSETS}/images/sensor-blur.png`
                  : getThumbnailUrl(video),
                'thumbnail'
              )}
              alt="thumbnail"
              draggable={false}
              className="object-cover object-center w-full h-full rounded-t-xl lg:w-full lg:h-full"
            />
            {isSensitiveContent && (
              <div className="absolute top-2 left-3">
                <span className="py-0.5 text-[10px] px-2 text-black bg-white rounded-full">
                  Sensitive Content
                </span>
              </div>
            )}
            {!isSensitiveContent && videoDuration ? (
              <div>
                <span className="py-0.5 absolute bottom-2 right-2 text-xs px-1 text-white bg-black rounded">
                  {getTimeFromSeconds(videoDuration)}
                </span>
              </div>
            ) : null}
          </div>
        </a>
      </Link>
      <div className="p-2">
        <div className="flex items-start space-x-2.5">
          <Link href={`/${video.profile?.handle}`}>
            <a className="flex-none mt-0.5">
              <img
                className="w-8 h-8 rounded-xl"
                src={getProfilePicture(mirrorOf.profile)}
                alt="channel picture"
                draggable={false}
              />
            </a>
          </Link>
          <div className="flex flex-col items-start flex-1">
            <div className="flex w-full items-start justify-between space-x-1.5">
              <Link href={`/watch/${mirrorOf.id}`}>
                <a className="font-medium text-[15px] line-clamp-1 opacity-80">
                  {video.metadata?.name}
                </a>
              </Link>
            </div>
            <Link passHref href={`/${video.profile?.handle}`}>
              <a className="text-xs hover:opacity-100 opacity-70">
                {mirrorOf.profile?.handle}
              </a>
            </Link>
          </div>
        </div>
        <div className="relative pb-1.5 pt-4 overflow-hidden text-sm opacity-90">
          <>
            <div className="absolute left-3 bottom-2.5 pb-2 inset-0 flex justify-center w-1.5">
              <div className="w-0.5 bg-gray-300 dark:bg-gray-700 pointer-events-none" />
            </div>
            <Tooltip content="Mirrored">
              <span className="absolute m-2 mb-0 bottom-1 opacity-70">
                <MdPublishedWithChanges />
              </span>
            </Tooltip>
          </>
          <div className="pl-8">
            <div className="flex items-center text-xs leading-3 opacity-70">
              <Link href={`/${video.profile?.handle}`}>
                <a className="opacity-90 hover:opacity-100">
                  {video.profile?.handle}
                </a>
              </Link>
              <span className="middot" />
              <span title={video.createdAt}>
                {dayjs(new Date(video.createdAt)).fromNow()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MirroredVideoCard
