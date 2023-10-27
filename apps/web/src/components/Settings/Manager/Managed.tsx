import { NoDataFound } from '@components/UIElements/NoDataFound'
import useProfileStore from '@lib/store/profile'
import { Avatar, Flex } from '@radix-ui/themes'
import { formatNumber, getProfile, getProfilePicture } from '@tape.xyz/generic'
import type { Profile } from '@tape.xyz/lens'
import { useProfilesManagedQuery } from '@tape.xyz/lens'
import { Loader } from '@tape.xyz/ui'
import Link from 'next/link'
import React from 'react'

const Managed = () => {
  const activeProfile = useProfileStore(
    (state) => state.activeProfile
  ) as Profile
  const address = getProfile(activeProfile).address

  const { data, loading, error } = useProfilesManagedQuery({
    variables: { request: { for: address } },
    skip: !address
  })
  const profilesManaged = data?.profilesManaged.items as Profile[]

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
      </div>
    </div>
  )
}

export default Managed
