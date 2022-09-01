import { useQuery } from '@apollo/client'
import TimelineShimmer from '@components/Shimmers/TimelineShimmer'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import { PROFILE_FEED_QUERY } from '@gql/queries'
import useAppStore from '@lib/store'
import usePersistStore from '@lib/store/persist'
import { LENSTUBE_APP_ID } from '@utils/constants'
import { COMMENTED_LIBRARY } from '@utils/url-path'
import Link from 'next/link'
import React, { useState } from 'react'
import { AiOutlineComment } from 'react-icons/ai'
import { BiChevronRight } from 'react-icons/bi'
import { PublicationTypes } from 'src/types'
import { LenstubePublication } from 'src/types/local'

import CommentedVideoCard from '../CommentedVideoCard'

const Commented = () => {
  const [commented, setCommented] = useState<LenstubePublication[]>([])
  const selectedChannelId = usePersistStore((state) => state.selectedChannelId)
  const selectedChannel = useAppStore((state) => state.selectedChannel)

  const { loading, data } = useQuery(PROFILE_FEED_QUERY, {
    variables: {
      request: {
        publicationTypes: [PublicationTypes.Comment],
        profileId: selectedChannel?.id,
        limit: 4,
        sources: [LENSTUBE_APP_ID]
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
        <Link
          href={COMMENTED_LIBRARY}
          className="flex items-center space-x-0.5 text-xs text-indigo-500"
        >
          <span>See all</span> <BiChevronRight />
        </Link>
      </div>
      {!selectedChannelId && (
        <NoDataFound text="Sign In to view videos that you commented on." />
      )}
      {loading && <TimelineShimmer />}
      {!data?.publications?.items.length && !loading && selectedChannelId && (
        <NoDataFound text="This list has no videos." />
      )}
      <div className="grid gap-x-4 lg:grid-cols-4 gap-y-1.5 md:gap-y-6 2xl:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 xs:grid-col-1">
        {commented?.map((video: LenstubePublication) => (
          <CommentedVideoCard
            key={`${video?.id}_${video.createdAt}`}
            video={video}
          />
        ))}
      </div>
    </div>
  )
}

export default Commented
