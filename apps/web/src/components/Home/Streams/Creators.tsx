import FollowActions from '@components/Common/FollowActions'
import UserProfile from '@components/Common/UserProfile'
import { CREATORS } from '@tape.xyz/constants/verified/creators'
import { shuffleArray } from '@tape.xyz/generic'
import type { Profile } from '@tape.xyz/lens'
import { useProfilesQuery } from '@tape.xyz/lens'
import { Loader } from '@tape.xyz/ui'
import React from 'react'

const shuffled = shuffleArray(CREATORS).slice(0, 6)

const Creators = () => {
  const { data, loading } = useProfilesQuery({
    variables: {
      request: {
        where: { profileIds: shuffled }
      }
    }
  })
  const profiles = data?.profiles.items as Profile[]

  return (
    <div className="rounded-medium tape-border flex-1 px-4 py-3">
      <h1 className="laptop:text-2xl text-xl font-bold">Creators to follow</h1>
      <div className="flex h-full flex-col flex-wrap space-y-2.5 pt-4">
        {loading && (
          <div className="flex flex-1 items-center justify-center">
            <Loader />
          </div>
        )}
        {!loading &&
          profiles?.map((profile) => (
            <div key={profile.id} className="flex items-center justify-between">
              <UserProfile profile={profile} />
              <FollowActions profile={profile} size="1" />
            </div>
          ))}
      </div>
    </div>
  )
}

export default Creators
