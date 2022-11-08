import Tooltip from '@components/UIElements/Tooltip'
import useAppStore from '@lib/store'
import { STATIC_ASSETS } from '@utils/constants'
import { getTimeFromSeconds } from '@utils/functions/formatTime'
import { getValueFromTraitType } from '@utils/functions/getFromAttributes'
import { getIsSensitiveContent } from '@utils/functions/getIsSensitiveContent'
import {
  getIsIPFSUrl,
  getPermanentVideoUrl
} from '@utils/functions/getVideoUrl'
import { useRouter } from 'next/router'
import React from 'react'
import { Attribute } from 'src/types/lens'
import { LenstubePublication } from 'src/types/local'

const ThumbnailOverlays = ({ video }: { video: LenstubePublication }) => {
  const selectedChannel = useAppStore((state) => state.selectedChannel)

  const { pathname } = useRouter()

  const isVideoOwner = selectedChannel?.id === video?.profile?.id
  const isSensitiveContent = getIsSensitiveContent(video.metadata, video.id)
  const isIPFS = getIsIPFSUrl(getPermanentVideoUrl(video))
  const videoDuration = getValueFromTraitType(
    video.metadata?.attributes as Attribute[],
    'durationInSeconds'
  )

  return (
    <>
      {isSensitiveContent && (
        <div>
          <span className="py-0.5 text-xs absolute top-2 left-2 px-2 text-black bg-white rounded-full">
            Sensitive Content
          </span>
        </div>
      )}
      {isIPFS && isVideoOwner && pathname === '/[channel]' ? (
        <div>
          <Tooltip content="Video stored on IPFS" placement="left">
            <span className="absolute z-[1] rounded-full top-2 right-2">
              <img
                src={`${STATIC_ASSETS}/images/social/ipfs-logo.webp`}
                alt="ipfs"
                className="w-5 h-5 rounded-full"
              />
            </span>
          </Tooltip>
        </div>
      ) : null}
      {!isSensitiveContent && videoDuration ? (
        <div>
          <span className="py-0.5 absolute bottom-2 right-2 text-xs px-1 text-white bg-black rounded">
            {getTimeFromSeconds(videoDuration)}
          </span>
        </div>
      ) : null}
    </>
  )
}

export default ThumbnailOverlays
