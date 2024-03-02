import Badge from '@components/Common/Badge'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import useProfileStore from '@lib/store/idb/profile'
import { INFINITE_SCROLL_ROOT_MARGIN } from '@tape.xyz/constants'
import {
  formatNumber,
  getProfile,
  getProfileCoverPicture,
  getProfilePicture,
  imageCdn,
  sanitizeDStorageUrl
} from '@tape.xyz/generic'
import type { Profile, ProfilesManagedRequest } from '@tape.xyz/lens'
import { useProfilesManagedQuery } from '@tape.xyz/lens'
import { Spinner } from '@tape.xyz/ui'
import Link from 'next/link'
import React from 'react'
import { useInView } from 'react-cool-inview'

const Managed = () => {
  const activeProfile = useProfileStore(
    (state) => state.activeProfile
  ) as Profile
  const address = getProfile(activeProfile).address

  const request: ProfilesManagedRequest = { for: address }
  const { data, loading, error, fetchMore } = useProfilesManagedQuery({
    variables: { request, lastLoggedInProfileRequest: { for: address } },
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
        {loading && <Spinner className="my-10" />}
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
                    <img
                      className="size-10 rounded-full border-2 border-white bg-white object-cover dark:bg-gray-900"
                      src={getProfilePicture(profile, 'AVATAR')}
                      alt={getProfile(profile)?.displayName}
                      draggable={false}
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
            <Spinner />
          </span>
        )}
      </div>
    </div>
  )
}

export default Managed
