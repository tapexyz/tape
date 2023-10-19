import { NoDataFound } from '@components/UIElements/NoDataFound'
import useProfileStore from '@lib/store/profile'
import { Avatar, Table } from '@radix-ui/themes'
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
        {((!loading && !profilesManaged?.length) || error) && (
          <NoDataFound withImage isCenter />
        )}
        {profilesManaged?.length && (
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Avatar</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Id</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Handle</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Followers</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {profilesManaged?.map((profile) => (
                <Table.Row key={profile.id}>
                  <Table.RowHeaderCell>
                    <Avatar
                      radius="full"
                      size="1"
                      src={getProfilePicture(profile)}
                      fallback={getProfile(profile)?.displayName[0] ?? ';)'}
                    />
                  </Table.RowHeaderCell>
                  <Table.Cell>{profile.id}</Table.Cell>
                  <Table.Cell>{getProfile(profile).displayName}</Table.Cell>
                  <Table.Cell>
                    <Link href={`${getProfile(profile).link}`}>
                      {getProfile(profile).slug}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    {formatNumber(profile.stats.followers)}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        )}
      </div>
    </div>
  )
}

export default Managed
