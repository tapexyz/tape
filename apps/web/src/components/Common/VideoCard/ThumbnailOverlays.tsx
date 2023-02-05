import Tooltip from '@components/UIElements/Tooltip'
import useAppStore from '@lib/store'
import type { Attribute, Publication } from 'lens'
import { useRouter } from 'next/router'
import type { FC } from 'react'
import React from 'react'
import { STATIC_ASSETS } from 'utils'
import { getTimeFromSeconds } from 'utils/functions/formatTime'
import { getValueFromTraitType } from 'utils/functions/getFromAttributes'
import { getIsSensitiveContent } from 'utils/functions/getIsSensitiveContent'
import {
  getIsIPFSUrl,
  getPublicationMediaUrl
} from 'utils/functions/getPublicationMediaUrl'

type Props = {
  video: Publication
}

const ThumbnailOverlays: FC<Props> = ({ video }) => {
  const selectedChannel = useAppStore((state) => state.selectedChannel)

  const { pathname } = useRouter()

  const isVideoOwner = selectedChannel?.id === video?.profile?.id
  const isSensitiveContent = getIsSensitiveContent(video.metadata, video.id)
  const isIPFS = getIsIPFSUrl(getPublicationMediaUrl(video))
  const videoDuration = getValueFromTraitType(
    video.metadata?.attributes as Attribute[],
    'durationInSeconds'
  )

  return (
    <>
      {isSensitiveContent && (
        <div>
          <span className="absolute top-2 left-2 rounded-full bg-white py-0.5 px-2 text-xs text-black">
            Sensitive Content
          </span>
        </div>
      )}
      {isIPFS && isVideoOwner && pathname === '/[channel]' ? (
        <div>
          <Tooltip content="Video stored on IPFS" placement="left">
            <span className="absolute top-2 right-2 z-[1] rounded-full">
              <img
                src={`${STATIC_ASSETS}/images/social/ipfs-logo.webp`}
                alt="ipfs"
                className="h-5 w-5 rounded-full"
              />
            </span>
          </Tooltip>
        </div>
      ) : null}
      {!isSensitiveContent && videoDuration ? (
        <div>
          <span className="absolute bottom-2 right-2 rounded bg-black py-0.5 px-1 text-xs font-semibold text-white">
            {getTimeFromSeconds(videoDuration)}
          </span>
        </div>
      ) : null}
    </>
  )
}

export default ThumbnailOverlays
