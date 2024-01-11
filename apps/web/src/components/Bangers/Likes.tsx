import HoverableProfile from '@components/Common/HoverableProfile'
import { BangersBubbles } from '@components/Shimmers/BangersShimmer'
import { COMMON_REGEX } from '@tape.xyz/constants'
import {
  getProfile,
  getProfilePicture,
  getPublicationData
} from '@tape.xyz/generic'
import type {
  PrimaryPublication,
  ProfileWhoReactedResult,
  WhoReactedPublicationRequest
} from '@tape.xyz/lens'
import { LimitType, useWhoReactedPublicationQuery } from '@tape.xyz/lens'
import React from 'react'

const Likes = ({ post }: { post: PrimaryPublication }) => {
  const parsePublicationId = () => {
    const sharingLink = getPublicationData(post.metadata)?.content ?? ''
    const match = sharingLink.match(COMMON_REGEX.TAPE_WATCH)
    if (match && match[1]) {
      return match[1]
    } else {
      return post.id
    }
  }
  const publicationId = parsePublicationId()

  const request: WhoReactedPublicationRequest = {
    for: publicationId,
    limit: LimitType.TwentyFive
  }

  const { data, loading } = useWhoReactedPublicationQuery({
    variables: {
      request
    },
    skip: !publicationId
  })

  const profiles = data?.whoReactedPublication
    ?.items as ProfileWhoReactedResult[]

  return (
    <div className="no-scrollbar flex items-center -space-x-2 overflow-x-auto">
      <HoverableProfile profile={post.by}>
        <img
          className="z-[1] size-8 rounded-full"
          src={getProfilePicture(post.by)}
          alt={getProfile(post.by)?.displayName}
          draggable={false}
        />
      </HoverableProfile>
      {profiles?.slice(0, 20)?.map(
        ({ profile }) =>
          profile.id !== post.by.id && (
            <HoverableProfile profile={profile} key={profile.id}>
              <img
                className="z-[1] size-8 rounded-full"
                src={getProfilePicture(profile)}
                draggable={false}
                alt={getProfile(profile)?.displayName}
              />
            </HoverableProfile>
          )
      )}
      {loading && <BangersBubbles />}
    </div>
  )
}

export default Likes
