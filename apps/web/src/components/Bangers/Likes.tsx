import type {
  PrimaryPublication,
  ProfileWhoReactedResult,
  WhoReactedPublicationRequest
} from '@tape.xyz/lens'

import HoverableProfile from '@components/Common/HoverableProfile'
import { BangersBubbles } from '@components/Shimmers/BangersShimmer'
import { Avatar } from '@radix-ui/themes'
import { COMMON_REGEX } from '@tape.xyz/constants'
import {
  getProfile,
  getProfilePicture,
  getPublicationData
} from '@tape.xyz/generic'
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
    skip: !publicationId,
    variables: {
      request
    }
  })

  const profiles = data?.whoReactedPublication
    ?.items as ProfileWhoReactedResult[]

  return (
    <div className="no-scrollbar flex items-center -space-x-2 overflow-x-auto">
      <HoverableProfile profile={post.by}>
        <Avatar
          alt={getProfile(post.by)?.displayName}
          className="z-[1]"
          fallback={getProfile(post.by)?.displayName}
          radius="full"
          size="2"
          src={getProfilePicture(post.by)}
        />
      </HoverableProfile>
      {profiles?.slice(0, 20)?.map(
        ({ profile }) =>
          profile.id !== post.by.id && (
            <HoverableProfile key={profile.id} profile={profile}>
              <Avatar
                alt={getProfile(profile)?.displayName}
                fallback={getProfile(profile)?.displayName}
                radius="full"
                size="2"
                src={getProfilePicture(profile)}
              />
            </HoverableProfile>
          )
      )}
      {loading && <BangersBubbles />}
    </div>
  )
}

export default Likes
