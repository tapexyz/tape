import { useQuery } from '@apollo/client'
import Timeline from '@components/Home/Timeline'
import TimelineShimmer from '@components/Shimmers/TimelineShimmer'
import { Loader } from '@components/UIElements/Loader'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import { PROFILE_FEED_QUERY } from '@gql/queries'
import logger from '@lib/logger'
import { LENS_CUSTOM_FILTERS, LENSTUBE_BYTES_APP_ID } from '@utils/constants'
import React, { FC, useState } from 'react'
import { useInView } from 'react-cool-inview'
import { PaginatedResultInfo, Profile, PublicationTypes } from 'src/types'
import { LenstubePublication } from 'src/types/local'

type Props = {
  channel: Profile
}

const ChannelBytes: FC<Props> = ({ channel }) => {
  const [bytes, setBytes] = useState<LenstubePublication[]>([])
  const [pageInfo, setPageInfo] = useState<PaginatedResultInfo>()
  const { data, loading, error, fetchMore } = useQuery(PROFILE_FEED_QUERY, {
    variables: {
      request: {
        publicationTypes: [PublicationTypes.Post],
        profileId: channel?.id,
        limit: 12,
        sources: [LENSTUBE_BYTES_APP_ID],
        customFilters: LENS_CUSTOM_FILTERS
      }
    },
    skip: !channel?.id,
    onCompleted(data) {
      setPageInfo(data?.publications?.pageInfo)
      setBytes(data?.publications?.items)
    }
  })
  const { observe } = useInView({
    onEnter: async () => {
      try {
        const { data } = await fetchMore({
          variables: {
            request: {
              publicationTypes: [PublicationTypes.Post],
              profileId: channel?.id,
              cursor: pageInfo?.next,
              limit: 8,
              sources: [LENSTUBE_BYTES_APP_ID],
              customFilters: LENS_CUSTOM_FILTERS
            }
          }
        })
        setPageInfo(data?.publications?.pageInfo)
        setBytes([...bytes, ...data?.publications?.items])
      } catch (error) {
        logger.error('[Error Fetch Bytes]', error)
      }
    }
  })

  if (loading) return <TimelineShimmer />

  if (data?.publications?.items?.length === 0) {
    return <NoDataFound isCenter withImage text="No bytes found" />
  }

  return (
    <div className="w-full">
      {!error && !loading && (
        <>
          <Timeline videos={bytes} />
          {pageInfo?.next && bytes.length !== pageInfo?.totalCount && (
            <span ref={observe} className="flex justify-center p-10">
              <Loader />
            </span>
          )}
        </>
      )}
    </div>
  )
}

export default ChannelBytes
