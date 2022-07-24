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

type Props = {
  video: LenstubePublication | null
  playNext: () => void
  cancelPlayNext: () => void
}

const NextVideo: FC<Props> = ({ video, playNext, cancelPlayNext }) => {
  const [timeLeft, setTimeLeft] = useState(5)

  useEffect(() => {
    if (timeLeft === 0) {
      playNext()
    }
    if (!timeLeft) return

    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1)
    }, 1000)

    return () => clearInterval(intervalId)
  }, [timeLeft, playNext])

  if (!video) return null
  const isSensitiveContent = getIsSensitiveContent(
    video.metadata?.attributes,
    video.id
  )
  const videoDuration = getValueFromTraitType(
    video.metadata?.attributes as Attribute[],
    'durationInSeconds'
  )

  return (
    <div className="w-full h-3/4 absolute top-0 text-white">
      <div className="flex justify-center h-full items-center">
        <div className="mt-5">
          <p>Up next in {timeLeft} seconds</p>
          <div className="mt-3">
            <div className="flex justify-between">
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
                        className="object-cover object-center h-16 w-24 lg:h-32 lg:w-52 "
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
              <div className="px-2.5 overflow-hidden">
                <div className="flex flex-col items-start pb-1">
                  <div className="flex w-48 items-start overflow-hidden justify-between space-x-1.5">
                    <Link passHref href={`/watch/${video.id}`}>
                      <a className="overflow-hidden text-lg font-medium line-clamp-1">
                        <span className="flex line-clamp-2">
                          {video.metadata?.name}
                        </span>
                      </a>
                    </Link>
                  </div>
                  <div className="truncate">
                    <p className="text-xs truncate hover:opacity-100 opacity-70">
                      {video.profile?.handle}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="hidden lg:flex space-x-4 mt-5">
              <Button
                variant="secondary"
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
