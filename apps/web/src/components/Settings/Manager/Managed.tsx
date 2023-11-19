import Badge from '@components/Common/Badge'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import { INFINITE_SCROLL_ROOT_MARGIN } from '@dragverse/constants'
import {
  formatNumber,
  getProfile,
  getProfileCoverPicture,
  getProfilePicture,
  imageCdn,
  sanitizeDStorageUrl
} from '@dragverse/generic'
import type { Profile, ProfilesManagedRequest } from '@dragverse/lens'
import { useProfilesManagedQuery } from '@dragverse/lens'
import { Loader } from '@dragverse/ui'
import useProfileStore from '@lib/store/profile'
import { Avatar } from '@radix-ui/themes'
import Link from 'next/link'
import { useInView } from 'react-cool-inview'

const Managed = () => {
  const activeProfile = useProfileStore(
    (state) => state.activeProfile
  ) as Profile
  const address = getProfile(activeProfile).address

  const request: ProfilesManagedRequest = { for: address }
  const { data, loading, error, fetchMore } = useProfilesManagedQuery({
    variables: { request },
    skip: !address
  })
  const profilesManaged = data?.profilesManaged.items as Profile[]
  const pageInfo = data?.profilesManaged?.pageInfo

  const { observe } = useInView({
    threshold: 0.25,
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

  return (
    <div>
      <p>Profiles managed by you.</p>
      <div className="mt-3">
        {loading && <Loader className="my-10" />}
        {(!loading && !profilesManaged?.length) || error ? (
          <NoDataFound withImage isCenter />
        ) : null}
        {profilesManaged?.length ? (
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {profilesManaged?.map((profile) => (
              <div
                key={profile.id}
                className="tape-border rounded-small overflow-hidden"
              >
                <div
                  style={{
                    backgroundImage: `url(${imageCdn(
                      sanitizeDStorageUrl(getProfileCoverPicture(profile, true))
                    )})`
                  }}
                  className="bg-brand-500 relative h-20 w-full bg-cover bg-center bg-no-repeat"
                >
                  <div className="absolute bottom-3 left-3 flex-none">
                    <Avatar
                      className="border-2 border-white bg-white object-cover dark:bg-gray-900"
                      size="3"
                      fallback={getProfile(profile)?.displayName[0] ?? ';)'}
                      radius="medium"
                      src={getProfilePicture(profile, 'AVATAR')}
                      alt={getProfile(profile)?.displayName}
                    />
                  </div>
                </div>
                <div className="px-3 py-2.5">
                  <Link
                    href={getProfile(profile)?.link}
                    className="flex items-center space-x-1"
                  >
                    <span className="text-2xl font-bold leading-tight">
                      {getProfile(profile)?.slug}
                    </span>
                    <Badge id={profile?.id} size="lg" />
                  </Link>
                  <span>{formatNumber(profile.stats.followers)} followers</span>
                  {profile.metadata?.bio && (
                    <div className="line-clamp-2 py-2">
                      {profile.metadata?.bio}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : null}
        {pageInfo?.next && (
          <span ref={observe} className="flex justify-center p-10">
            <Loader />
          </span>
        )}
      </div>
    </div>
  )
}

export default Managed
