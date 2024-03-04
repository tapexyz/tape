import AudioCard from '@components/Common/AudioCard'
import AudioTimelineShimmer from '@components/Shimmers/AudioTimelineShimmer'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import {
  ALLOWED_APP_IDS,
  INFINITE_SCROLL_ROOT_MARGIN,
  IS_MAINNET,
  TAPE_APP_ID
} from '@tape.xyz/constants'
import type { Post, Profile, PublicationsRequest } from '@tape.xyz/lens'
import {
  LimitType,
  PublicationMetadataMainFocusType,
  PublicationType,
  usePublicationsQuery
} from '@tape.xyz/lens'
import { Spinner } from '@tape.xyz/ui'
import type { FC } from 'react'
import React from 'react'
import { useInView } from 'react-cool-inview'

type Props = {
  profile: Profile
}

const ProfileAudios: FC<Props> = ({ profile }) => {
  const request: PublicationsRequest = {
    where: {
      metadata: {
        mainContentFocus: [PublicationMetadataMainFocusType.Audio],
        publishedOn: IS_MAINNET ? [TAPE_APP_ID, ...ALLOWED_APP_IDS] : undefined
      },
      publicationTypes: [PublicationType.Post],
      from: profile.id
    },
    limit: LimitType.Fifty
  }

  const { data, loading, error, fetchMore } = usePublicationsQuery({
    variables: {
      request
    },
    skip: !profile?.id
  })

  const audios = data?.publications?.items as Post[]
  const pageInfo = data?.publications?.pageInfo

  const { observe } = useInView({
    rootMargin: INFINITE_SCROLL_ROOT_MARGIN,
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
    return <AudioTimelineShimmer className="lg:!grid-cols-4" count={4} />
  }

  if (audios?.length === 0) {
    return <NoDataFound isCenter withImage />
  }

  return !error && !loading ? (
    <div className="laptop:grid-cols-4 grid-col-1 grid gap-x-4 gap-y-2 md:grid-cols-3 md:gap-y-6">
      {audios?.map((audio: Post, i) => {
        return <AudioCard key={`${audio?.id}_${i}`} audio={audio} />
      })}
      {pageInfo?.next && (
        <span ref={observe} className="flex justify-center p-10">
          <Spinner />
        </span>
      )}
    </div>
  ) : null
}

export default ProfileAudios
