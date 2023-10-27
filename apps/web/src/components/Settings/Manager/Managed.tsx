import { NoDataFound } from '@components/UIElements/NoDataFound'
import useProfileStore from '@lib/store/profile'
import { Avatar, Flex, Table } from '@radix-ui/themes'
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
          <Table.Root mt="4" variant="surface">
            <Table.Body>
              {profilesManaged?.map((profile) => (
                <Table.Row key={profile.id}>
                  <Table.RowHeaderCell>
                    <Flex gap="2" align="center">
                      <Avatar
                        radius="full"
                        size="1"
                        src={getProfilePicture(profile)}
                        fallback={getProfile(profile)?.displayName[0] ?? ';)'}
                      />
                      <Link href={getProfile(profile).link}>
                        {getProfile(profile).displayName}
                      </Link>
                    </Flex>
                  </Table.RowHeaderCell>
                  <Table.Cell>{profile.id}</Table.Cell>
                  <Table.Cell>
                    {formatNumber(profile.stats.followers)} followers
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        ) : null}
      </div>
    </div>
  )
}

export default Managed
