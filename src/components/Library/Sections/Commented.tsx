import { useQuery } from '@apollo/client'
import VideoCard from '@components/Common/VideoCard'
import TimelineShimmer from '@components/Shimmers/TimelineShimmer'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import useAppStore from '@lib/store'
import {
  LENSTUBE_COMMENTS_APP_ID,
  LENSTUBE_VIDEOS_APP_ID
} from '@utils/constants'
import { PROFILE_FEED_QUERY } from '@utils/gql/queries'
import { COMMENTED_LIBRARY } from '@utils/url-path'
import Link from 'next/link'
import React, { useState } from 'react'
import { AiOutlineComment } from 'react-icons/ai'
import { BiChevronRight } from 'react-icons/bi'
import { LenstubePublication } from 'src/types/local'

const Commented = () => {
  const [commented, setCommented] = useState<LenstubePublication[]>([])
  const { selectedChannel } = useAppStore()

  const { loading } = useQuery(PROFILE_FEED_QUERY, {
    variables: {
      request: {
        publicationTypes: 'COMMENT',
        profileId: selectedChannel?.id,
        limit: 5,
        sources: [LENSTUBE_VIDEOS_APP_ID, LENSTUBE_COMMENTS_APP_ID]
      }
    },
    skip: !selectedChannel?.id,
    fetchPolicy: 'no-cache',
    onCompleted(data) {
      setCommented(data?.publications?.items)
    }
  })

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="inline-flex items-center space-x-2 text-lg font-semibold">
          <AiOutlineComment />
          <span>Commented</span>
        </h1>
        <Link href={COMMENTED_LIBRARY}>
          <a className="flex items-center space-x-0.5 text-xs text-green-900">
            <span>See all</span> <BiChevronRight />
          </a>
        </Link>
      </div>
      {(loading || !selectedChannel) && <TimelineShimmer />}
      {!commented.length && <NoDataFound text="This list has no videos." />}
      <div className="grid gap-x-4 lg:grid-cols-4 gap-y-1.5 md:gap-y-6 2xl:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 xs:grid-col-1">
        {commented?.map((video: LenstubePublication, idx: number) => (
          <VideoCard key={idx} video={video.commentOn as LenstubePublication} />
        ))}
      </div>
    </div>
  )
}

export default Commented
