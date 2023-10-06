import SharedLink from '@components/Home/OpenActions/SharedLink'
import OpenActionsShimmer from '@components/Shimmers/OpenActionsShimmer'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import { t } from '@lingui/macro'
import {
  LENS_CUSTOM_FILTERS,
  SCROLL_ROOT_MARGIN,
  TAPE_APP_ID
} from '@tape.xyz/constants'
import type {
  Profile,
  Publication,
  PublicationsQueryRequest
} from '@tape.xyz/lens'
import {
  PublicationMainFocus,
  PublicationTypes,
  useProfilePostsQuery
} from '@tape.xyz/lens'
import { Loader } from '@tape.xyz/ui'
import type { FC } from 'react'
import React from 'react'
import { useInView } from 'react-cool-inview'

type Props = {
  channel: Profile
}

const SharedLinks: FC<Props> = ({ channel }) => {
  const request: PublicationsQueryRequest = {
    publicationTypes: [PublicationTypes.Post],
    limit: 50,
    sources: [TAPE_APP_ID],
    customFilters: LENS_CUSTOM_FILTERS,
    profileId: channel?.id,
    metadata: {
      mainContentFocus: [PublicationMainFocus.Link]
    }
  }

  const { data, loading, error, fetchMore } = useProfilePostsQuery({
    variables: { request },
    skip: !channel?.id
  })

  const links = data?.publications?.items as Publication[]
  const pageInfo = data?.publications?.pageInfo

  const { observe } = useInView({
    rootMargin: SCROLL_ROOT_MARGIN,
    onEnter: async () => {
      await fetchMore({
        variables: {
          request: {
            ...request,
            cursor: pageInfo?.next
          }
        }
      })
    }
  })

  if (loading) {
    return <OpenActionsShimmer />
  }

  if (data?.publications?.items?.length === 0) {
    return <NoDataFound isCenter withImage text={t`No links found`} />
  }

  return (
    <div className="w-full">
      {!error && !loading && (
        <>
          <div className="grid gap-x-4 gap-y-2 md:grid-cols-4 md:gap-y-8 lg:grid-cols-5">
            {links?.map(({ metadata }: Publication, i) => {
              return <SharedLink key={i} metadata={metadata} />
            })}
          </div>
          {pageInfo?.next && (
            <span ref={observe} className="flex justify-center p-10">
              <Loader />
            </span>
          )}
        </>
      )}
    </div>
  )
}

export default SharedLinks
