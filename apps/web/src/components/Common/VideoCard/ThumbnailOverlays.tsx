import { getIsSensitiveContent, getPublication } from '@lenstube/generic'
import type { AnyPublication, VideoMetadataV3 } from '@lenstube/lens'
import { getTimeFromSeconds } from '@lib/formatTime'
import { Trans } from '@lingui/macro'
import type { FC } from 'react'
import React from 'react'

type Props = {
  video: AnyPublication
}

const ThumbnailOverlays: FC<Props> = ({ video }) => {
  const targetPublication = getPublication(video)
  const metadata = targetPublication.metadata as VideoMetadataV3
  const isSensitiveContent = getIsSensitiveContent(metadata, video.id)
  const videoDuration = metadata.asset.duration

  return (
    <>
      {isSensitiveContent && (
        <div>
          <span className="absolute left-2 top-2 rounded-full bg-white px-2 py-0.5 text-xs text-black">
            <Trans>Sensitive Content</Trans>
          </span>
        </div>
      )}
      {videoDuration ? (
        <div>
          <span className="absolute bottom-2 right-2 rounded bg-black px-1 py-0.5 text-xs font-semibold text-white">
            {getTimeFromSeconds(String(videoDuration))}
          </span>
        </div>
      ) : null}
    </>
  )
}

export default ThumbnailOverlays
