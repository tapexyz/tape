import useCuratedProfiles from '@lib/store/idb/curated'
import { TAPE_CURATOR_ID } from '@tape.xyz/constants'
import type { FollowingRequest } from '@tape.xyz/lens'
import { LimitType, useFollowingQuery } from '@tape.xyz/lens'

const followingRequest: FollowingRequest = {
  for: TAPE_CURATOR_ID,
  limit: LimitType.Fifty
}

const CuratedProfilesProvider = () => {
  const setCuratedProfiles = useCuratedProfiles(
    (state) => state.setCuratedProfiles
  )

  useFollowingQuery({
    variables: { request: followingRequest },
    onCompleted: ({ following }) => {
      const followings = following?.items.map((p) => p.id)
      setCuratedProfiles(followings)
    }
  })

  return null
}

export default CuratedProfilesProvider
