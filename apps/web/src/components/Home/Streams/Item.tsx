import UserProfile from '@components/Common/UserProfile'
import { Button } from '@radix-ui/themes'
import type { Profile } from '@tape.xyz/lens'
import { useProfileQuery } from '@tape.xyz/lens'
import type { ChannelStreamType } from '@tape.xyz/lens/custom-types'
import VideoPlayer from '@tape.xyz/ui/VideoPlayer'
import Link from 'next/link'
import React, { memo } from 'react'

const Item = ({ stream }: { stream: ChannelStreamType }) => {
  const { data } = useProfileQuery({
    variables: {
      request: {
        forHandle: stream?.streamer
      }
    },
    skip: !stream?.streamer
  })
  const profile = data?.profile as Profile

  return (
    <div className="keen-slider__slide relative flex justify-between">
      <div className="absolute z-[6] flex h-full w-full flex-col justify-evenly space-y-6 bg-black bg-opacity-50 p-6 lg:static">
        <div className="space-y-3">
          <h1 className="laptop:text-4xl text-2xl font-bold">{stream.title}</h1>
          <p className="ultrawide:line-clamp-5 line-clamp-1 md:line-clamp-3">
            {stream.content}
          </p>
          <div>
            <UserProfile profile={profile} />
          </div>
        </div>
        <span>
          <Link href={`/stream/channel/${stream.channel}`}>
            <Button color="gray" highContrast>
              {stream.isLive && (
                <span className="relative flex h-2 w-2 items-center justify-center">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-500" />
                </span>
              )}
              Watch Now
            </Button>
          </Link>
        </span>
      </div>
      <div className="relative aspect-[16/9]">
        <div className="absolute inset-0 z-[5] bg-gradient-to-r from-black via-transparent to-transparent" />
        <VideoPlayer
          url={stream.liveUrl}
          posterUrl={stream.posterUrl}
          showControls={false}
          options={{
            autoPlay: true,
            muted: true,
            loadingSpinner: true,
            maxHeight: true
          }}
        />
      </div>
    </div>
  )
}

export default memo(Item)
