import { NoDataFound } from '@components/UIElements/NoDataFound'
import useProfileStore from '@lib/store/profile'
import { Avatar, Flex } from '@radix-ui/themes'
import { INFINITE_SCROLL_ROOT_MARGIN } from '@tape.xyz/constants'
import { formatNumber, getProfile, getProfilePicture } from '@tape.xyz/generic'
import type { Profile, ProfilesManagedRequest } from '@tape.xyz/lens'
import { useProfilesManagedQuery } from '@tape.xyz/lens'
import { Loader } from '@tape.xyz/ui'
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
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {profilesManaged?.map((profile) => (
              <div
                key={profile.id}
                className="tape-border rounded-small flex items-center justify-between px-4 py-3"
              >
                <Flex gap="2" align="center">
                  <Avatar
                    radius="full"
                    size="1"
                    src={getProfilePicture(profile)}
                    fallback={getProfile(profile)?.displayName[0] ?? ';)'}
                    alt={getProfile(profile)?.displayName}
                  />
                  <Link href={getProfile(profile).link}>
                    {getProfile(profile).displayName} ({profile.id})
                  </Link>
                </Flex>
                <span>{formatNumber(profile.stats.followers)} followers</span>
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
