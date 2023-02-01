import VideoCard from '@components/Common/VideoCard'
import PinnedVideoShimmer from '@components/Shimmers/PinnedVideoShimmer'
import useAppStore from '@lib/store'
import type { Publication } from 'lens'
import { usePublicationDetailsQuery } from 'lens'
import type { FC } from 'react'
import React, { useEffect } from 'react'
import { getValueFromKeyInAttributes } from 'utils/functions/getFromAttributes'
import isWatchable from 'utils/functions/isWatchable'

type Props = {
  id: string
}

const PinnedVideo: FC<Props> = ({ id }) => {
  const selectedChannel = useAppStore((state) => state.selectedChannel)
  const pinnedPublicationId = getValueFromKeyInAttributes(
    selectedChannel?.attributes,
    'pinnedPublicationId'
  )

  const { data, error, loading, refetch } = usePublicationDetailsQuery({
    variables: {
      request: { publicationId: id }
    },
    skip: !id
  })
  const pinnedPublication = data?.publication as Publication

  // refetch on update own channel's pinned video
  useEffect(() => {
    refetch({
      request: { publicationId: pinnedPublicationId }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pinnedPublicationId])

  if (loading) {
    return <PinnedVideoShimmer />
  }

  if (error || !isWatchable(pinnedPublication)) {
    return null
  }

  return (
    <div className="mb-5 grid border-b border-gray-300 pb-3 dark:border-gray-700 sm:grid-cols-2 lg:grid-cols-5">
      <VideoCard video={pinnedPublication} />
    </div>
  )
}

export default PinnedVideo
