import HoverableProfile from '@components/Common/HoverableProfile'
import { BangersBubbles } from '@components/Shimmers/BangersShimmer'
import { COMMON_REGEX } from '@dragverse/constants'
import {
  getProfile,
  getProfilePicture,
  getPublicationData
} from '@dragverse/generic'
import type {
  PrimaryPublication,
  Profile,
  ProfilesRequest
} from '@dragverse/lens'
import { LimitType, useProfilesQuery } from '@dragverse/lens'
import { Avatar } from '@radix-ui/themes'

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
