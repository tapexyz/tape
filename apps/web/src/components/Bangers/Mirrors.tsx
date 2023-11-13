import HoverableProfile from '@components/Common/HoverableProfile'
import { BangersBubbles } from '@components/Shimmers/BangersShimmer'
import { Avatar } from '@radix-ui/themes'
import { COMMON_REGEX } from '@tape.xyz/constants'
import {
  getProfile,
  getProfilePicture,
  getPublicationData
} from '@tape.xyz/generic'
import type {
  PrimaryPublication,
  Profile,
  ProfilesRequest
} from '@tape.xyz/lens'
import { LimitType, useProfilesQuery } from '@tape.xyz/lens'
import React from 'react'

const Mirrors = ({ post }: { post: PrimaryPublication }) => {
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

  const request: ProfilesRequest = {
    where: {
      whoMirroredPublication: publicationId
    },
    limit: LimitType.Fifty
  }

  const { data, loading } = useProfilesQuery({
    variables: {
      request
    },
    skip: !publicationId
  })

  const mirroredByProfiles = data?.profiles?.items as Profile[]

  return (
    <div className="no-scrollbar flex items-center -space-x-2 overflow-x-auto">
      <HoverableProfile profile={post.by}>
        <Avatar
          size="2"
          radius="full"
          className="z-[1]"
          src={getProfilePicture(post.by)}
          fallback={getProfile(post.by)?.displayName}
          alt={getProfile(post.by)?.displayName}
        />
      </HoverableProfile>
      {mirroredByProfiles?.slice(0, 20)?.map((profile) => (
        <HoverableProfile profile={profile} key={profile.id}>
          <Avatar
            size="2"
            radius="full"
            src={getProfilePicture(profile)}
            fallback={getProfile(profile)?.displayName}
            alt={getProfile(profile)?.displayName}
          />
        </HoverableProfile>
      ))}
      {loading && <BangersBubbles />}
    </div>
  )
}

export default Mirrors
