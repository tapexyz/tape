import { Button } from '@components/UIElements/Button'
import { STATIC_ASSETS } from '@utils/constants'
import { getTimeFromSeconds } from '@utils/functions/formatTime'
import { getValueFromTraitType } from '@utils/functions/getFromAttributes'
import { getIsSensitiveContent } from '@utils/functions/getIsSensitiveContent'
import getThumbnailUrl from '@utils/functions/getThumbnailUrl'
import imageCdn from '@utils/functions/imageCdn'
import Link from 'next/link'
import React, { FC, useEffect, useState } from 'react'
import { Attribute } from 'src/types'
import { LenstubePublication } from 'src/types/local'

import IsVerified from '../IsVerified'

type Props = {
  video: LenstubePublication | null
  playNext: () => void
  cancelPlayNext: () => void
}

const NextVideo: FC<Props> = ({ video, playNext, cancelPlayNext }) => {
  const [timeLeft, setTimeLeft] = useState(5)

  useEffect(() => {
    if (timeLeft === 0) playNext()
    if (!timeLeft) return
    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1)
    }, 1000)

    return () => clearInterval(intervalId)
  }, [timeLeft, playNext])

  if (!video) return null

  const isSensitiveContent = getIsSensitiveContent(video.metadata, video.id)
  const videoDuration = getValueFromTraitType(
    video.metadata?.attributes as Attribute[],
    'durationInSeconds'
  )

  return (
    <div className="absolute top-0 w-full text-white h-3/4">
      <div className="flex items-center justify-center h-full">
        <div className="px-2 mt-3 md:mt-5">
          <p className="text-sm md:text-base">Up next in {timeLeft} seconds</p>
          <div className="mt-1 md:mt-3">
            <div className="flex justify-between space-x-2">
              <div className="flex-none overflow-hidden rounded-lg">
                <Link href={`/watch/${video.id}`}>
                  <a className="rounded-lg cursor-pointer">
                    <div className="relative">
                      <img
                        src={imageCdn(
                          isSensitiveContent
                            ? `${STATIC_ASSETS}/images/sensor-blur.png`
                            : getThumbnailUrl(video),
                          'thumbnail'
                        )}
                        alt="thumbnail"
                        draggable={false}
                        className="object-cover object-center w-24 h-16 lg:h-32 lg:w-56 "
                      />
                      {!isSensitiveContent && videoDuration ? (
                        <div>
                          <span className="absolute bottom-1 right-1 text-[10px] px-1 text-white bg-black rounded">
                            {getTimeFromSeconds(videoDuration)}
                          </span>
                        </div>
                      ) : null}
                    </div>
                  </a>
                </Link>
              </div>
              <div className="overflow-hidden">
                <div className="flex flex-col items-start">
                  <div className="flex md:w-48 items-start overflow-hidden justify-between space-x-1.5">
                    <Link passHref href={`/watch/${video.id}`}>
                      <a className="overflow-hidden md:text-lg">
                        <span className="flex md:font-medium line-clamp-2">
                          {video.metadata?.name}
                        </span>
                      </a>
                    </Link>
                  </div>
                  <p className="flex items-center space-x-1 text-xs truncate md:text-sm opacity-80">
                    <span>{video.profile?.handle}</span>
                    <IsVerified id={video.profile?.id} size="xs" />
                  </p>
                </div>
              </div>
            </div>
            <div className="hidden mt-5 space-x-4 lg:flex">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  cancelPlayNext()
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  playNext()
                }}
                size="sm"
              >
                Play Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NextVideo
