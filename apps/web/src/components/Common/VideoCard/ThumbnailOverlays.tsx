import {
  getIsSensitiveContent,
  getPublication,
  getTimeFromSeconds,
  getValueFromTraitType
} from '@lenstube/generic'
import type { AnyPublication, Attribute } from '@lenstube/lens'
import { Trans } from '@lingui/macro'
import type { FC } from 'react'
import React from 'react'

type Props = {
  video: AnyPublication
}

const ThumbnailOverlays: FC<Props> = ({ video }) => {
  const targetPublication = getPublication(video)
  const isSensitiveContent = getIsSensitiveContent(
    targetPublication.metadata,
    video.id
  )
  const videoDuration = getValueFromTraitType(
    targetPublication.metadata?.marketplace?.attributes as Attribute[],
    'durationInSeconds'
  )

  return (
    <>
      {isSensitiveContent && (
        <div>
          <span className="absolute left-2 top-2 rounded-full bg-white px-2 py-0.5 text-xs text-black">
            <Trans>Sensitive Content</Trans>
          </span>
        </div>
      )}
      {!isSensitiveContent && videoDuration ? (
        <div>
          <span className="absolute bottom-2 right-2 rounded bg-black px-1 py-0.5 text-xs font-semibold text-white">
            {getTimeFromSeconds(videoDuration)}
          </span>
        </div>
      ) : null}
    </>
  )
}

export default ThumbnailOverlays
