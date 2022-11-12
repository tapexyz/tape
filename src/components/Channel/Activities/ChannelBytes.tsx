import { useQuery } from '@apollo/client'
import Timeline from '@components/Home/Timeline'
import TimelineShimmer from '@components/Shimmers/TimelineShimmer'
import { Loader } from '@components/UIElements/Loader'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import {
  LENS_CUSTOM_FILTERS,
  LENSTUBE_BYTES_APP_ID,
  SCROLL_ROOT_MARGIN
} from '@utils/constants'
import React, { FC, useState } from 'react'
import { useInView } from 'react-cool-inview'
import {
  PaginatedResultInfo,
  Profile,
  ProfilePostsDocument,
  PublicationTypes
} from 'src/types/lens'
import { LenstubePublication } from 'src/types/local'

type Props = {
  channel: Profile
}

const request = {
  publicationTypes: [PublicationTypes.Post],
  limit: 30,
  sources: [LENSTUBE_BYTES_APP_ID],
  customFilters: LENS_CUSTOM_FILTERS
}

const ChannelBytes: FC<Props> = ({ channel }) => {
  const [bytes, setBytes] = useState<LenstubePublication[]>([])
  const [pageInfo, setPageInfo] = useState<PaginatedResultInfo>()
  const { data, loading, error, fetchMore } = useQuery(ProfilePostsDocument, {
    variables: {
      request: {
        ...request,
        profileId: channel?.id
      }
    },
    skip: !channel?.id,
    onCompleted(data) {
      setPageInfo(data?.publications?.pageInfo)
      setBytes(data?.publications?.items as LenstubePublication[])
    }
  })
  const { observe } = useInView({
    rootMargin: SCROLL_ROOT_MARGIN,
    onEnter: async () => {
      try {
        const { data } = await fetchMore({
          variables: {
            request: {
              ...request,
              profileId: channel?.id,
              cursor: pageInfo?.next
            }
          }
        })
        setPageInfo(data?.publications?.pageInfo)
        setBytes([
          ...bytes,
          ...(data?.publications?.items as LenstubePublication[])
        ])
      } catch {}
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
