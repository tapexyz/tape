import type { Post, Profile, PublicationsRequest } from '@tape.xyz/lens'
import type { FC } from 'react'

import AudioCard from '@components/Common/AudioCard'
import AudioTimelineShimmer from '@components/Shimmers/AudioTimelineShimmer'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import {
  ALLOWED_APP_IDS,
  INFINITE_SCROLL_ROOT_MARGIN,
  IS_MAINNET,
  LENS_CUSTOM_FILTERS,
  TAPE_APP_ID
} from '@tape.xyz/constants'
import {
  LimitType,
  PublicationMetadataMainFocusType,
  PublicationType,
  usePublicationsQuery
} from '@tape.xyz/lens'
import { Loader } from '@tape.xyz/ui'
import React from 'react'
import { useInView } from 'react-cool-inview'

type Props = {
  profile: Profile
}

const ProfileAudios: FC<Props> = ({ profile }) => {
  const request: PublicationsRequest = {
    limit: LimitType.Fifty,
    where: {
      customFilters: LENS_CUSTOM_FILTERS,
      from: profile.id,
      metadata: {
        mainContentFocus: [PublicationMetadataMainFocusType.Audio],
        publishedOn: IS_MAINNET ? [TAPE_APP_ID, ...ALLOWED_APP_IDS] : undefined
      },
      publicationTypes: [PublicationType.Post]
    }
  }

  const { data, error, fetchMore, loading } = usePublicationsQuery({
    skip: !profile?.id,
    variables: {
      request
    }
  })

  const audios = data?.publications?.items as Post[]
  const pageInfo = data?.publications?.pageInfo

  const { observe } = useInView({
    onEnter: async () => {
      await fetchMore({
        variables: {
          request: {
            ...request,
            cursor: pageInfo?.next
          }
        }
      })
    },
    rootMargin: INFINITE_SCROLL_ROOT_MARGIN
  })

  if (loading) {
    return <AudioTimelineShimmer className="lg:!grid-cols-4" count={4} />
  }

  if (audios?.length === 0) {
    return <NoDataFound isCenter withImage />
  }

  return !error && !loading ? (
    <div className="laptop:grid-cols-4 grid-col-1 grid gap-x-4 gap-y-2 md:grid-cols-3 md:gap-y-6">
      {audios?.map((audio: Post, i) => {
        return <AudioCard audio={audio} key={`${audio?.id}_${i}`} />
      })}
      {pageInfo?.next && (
        <span className="flex justify-center p-10" ref={observe}>
          <Loader />
        </span>
      )}
    </div>
  ) : null
}

export default ProfileAudios
