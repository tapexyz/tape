import VideoCard from '@components/Common/VideoCard'
import PinnedVideoShimmer from '@components/Shimmers/PinnedVideoShimmer'
import type { Profile, Publication } from 'lens'
import { usePublicationDetailsQuery } from 'lens'
import type { FC } from 'react'
import React from 'react'
import { getValueFromKeyInAttributes } from 'utils/functions/getFromAttributes'

type Props = {
  channel: Profile
}

const PinnedVideo: FC<Props> = ({ channel }) => {
  const pinnedPublicationId = getValueFromKeyInAttributes(
    channel?.attributes,
    'pinnedPublicationId'
  )

  const { data, error, loading } = usePublicationDetailsQuery({
    variables: {
      request: { publicationId: pinnedPublicationId }
    },
    skip: !pinnedPublicationId
  })
  const pinnedPublication = data?.publication as Publication

  const publicationType = pinnedPublication?.__typename
  const canWatch =
    pinnedPublication &&
    publicationType &&
    ['Post', 'Comment'].includes(publicationType) &&
    !pinnedPublication?.hidden

  if (loading) {
    return <PinnedVideoShimmer />
  }

  if (!pinnedPublicationId || error || !canWatch) {
    return null
  }

  return (
    <div className="mb-5 grid grid-cols-5 border-b border-gray-300 pb-3 dark:border-gray-700">
      <VideoCard video={pinnedPublication} />
    </div>
  )
}

export default PinnedVideo
