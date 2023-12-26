import type { Profile, ProfilesManagedRequest } from '@tape.xyz/lens'

import Badge from '@components/Common/Badge'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import useProfileStore from '@lib/store/idb/profile'
import { Avatar } from '@radix-ui/themes'
import { INFINITE_SCROLL_ROOT_MARGIN } from '@tape.xyz/constants'
import {
  formatNumber,
  getProfile,
  getProfileCoverPicture,
  getProfilePicture,
  imageCdn,
  sanitizeDStorageUrl
} from '@tape.xyz/generic'
import { useProfilesManagedQuery } from '@tape.xyz/lens'
import { Loader } from '@tape.xyz/ui'
import Link from 'next/link'
import React from 'react'
import { useInView } from 'react-cool-inview'

const Managed = () => {
  const activeProfile = useProfileStore(
    (state) => state.activeProfile
  ) as Profile
  const { address } = getProfile(activeProfile)

  const request: ProfilesManagedRequest = { for: address }
  const { data, error, fetchMore, loading } = useProfilesManagedQuery({
    skip: !address,
    variables: { request }
  })
  const profilesManaged = data?.profilesManaged.items as Profile[]
  const pageInfo = data?.profilesManaged?.pageInfo

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
    rootMargin: INFINITE_SCROLL_ROOT_MARGIN,
    threshold: 0.25
  })

  return (
    <div>
      <p>Profiles managed by you.</p>
      <div className="mt-3">
        {loading && <Loader className="my-10" />}
        {(!loading && !profilesManaged?.length) || error ? (
          <NoDataFound isCenter withImage />
        ) : null}
        {profilesManaged?.length ? (
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {profilesManaged?.map((profile) => (
              <div
                className="tape-border rounded-small overflow-hidden"
                key={profile.id}
              >
                <div
                  className="bg-brand-500 relative h-20 w-full bg-cover bg-center bg-no-repeat"
                  style={{
                    backgroundImage: `url(${imageCdn(
                      sanitizeDStorageUrl(getProfileCoverPicture(profile, true))
                    )})`
                  }}
                >
                  <div className="absolute bottom-3 left-3 flex-none">
                    <Avatar
                      alt={getProfile(profile)?.displayName}
                      className="border-2 border-white bg-white object-cover dark:bg-gray-900"
                      fallback={getProfile(profile)?.displayName[0] ?? ';)'}
                      radius="medium"
                      size="3"
                      src={getProfilePicture(profile, 'AVATAR')}
                    />
                  </div>
                </div>
                <div className="px-3 py-2.5">
                  <Link
                    className="flex items-center space-x-1"
                    href={getProfile(profile)?.link}
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
          <span className="flex justify-center p-10" ref={observe}>
            <Loader />
          </span>
        )}
      </div>
    </div>
  )
}

export default Managed
