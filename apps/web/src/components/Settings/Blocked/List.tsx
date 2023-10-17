import Badge from '@components/Common/Badge'
import InterweaveContent from '@components/Common/InterweaveContent'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import useAuthPersistStore from '@lib/store/auth'
import { t } from '@lingui/macro'
import { Avatar, Button } from '@radix-ui/themes'
import {
  getProfile,
  getProfileCoverPicture,
  getProfilePicture,
  imageCdn,
  sanitizeDStorageUrl
} from '@tape.xyz/generic'
import type { Profile } from '@tape.xyz/lens'
import {
  LimitType,
  useUnblockMutation,
  useWhoHaveBlockedQuery
} from '@tape.xyz/lens'
import { Loader } from '@tape.xyz/ui'
import Link from 'next/link'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

const List = () => {
  const [unblockingProfileId, setUnblockingProfileId] = useState('')
  const selectedSimpleProfile = useAuthPersistStore(
    (state) => state.selectedSimpleProfile
  )

  const onError = (error: any) => {
    setUnblockingProfileId('')
    toast.error(error)
  }

  const onCompleted = () => {
    setUnblockingProfileId('')
    toast.success(t`Unblocked successfully`)
  }

  const { data, loading, error } = useWhoHaveBlockedQuery({
    variables: { request: { limit: LimitType.Fifty } },
    skip: !selectedSimpleProfile?.id
  })

  const [unBlock] = useUnblockMutation({
    onCompleted,
    onError,
    update: (cache) => {
      cache.evict({ id: 'ROOT_QUERY' })
    }
  })

  const blockedProfiles = data?.whoHaveBlocked?.items as Profile[]

  if (loading) {
    return <Loader className="my-20" />
  }

  if (!blockedProfiles?.length || error) {
    return <NoDataFound withImage isCenter />
  }

  const onClickUnblock = async (profileId: string) => {
    try {
      setUnblockingProfileId(profileId)
      await unBlock({
        variables: {
          request: {
            profiles: [profileId]
          }
        }
      })
    } catch (error) {
      onError(error)
    }
  }

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {blockedProfiles.map((profile) => (
        <div
          key={profile.id}
          className="tape-border rounded-small overflow-hidden"
        >
          <div
            style={{
              backgroundImage: `url(${imageCdn(
                sanitizeDStorageUrl(getProfileCoverPicture(profile))
              )})`
            }}
            className="bg-brand-500 relative h-20 w-full bg-cover bg-center bg-no-repeat"
          >
            <div className="absolute bottom-2 left-2 flex-none">
              <Avatar
                className="border-2 border-white bg-white object-cover dark:bg-gray-900"
                size="3"
                fallback={getProfile(profile)?.displayName.charAt(0) ?? ''}
                radius="medium"
                src={getProfilePicture(profile, 'AVATAR')}
              />
            </div>
            <div className="absolute bottom-2 right-2 flex-none">
              <Button
                onClick={() => onClickUnblock(profile.id)}
                disabled={unblockingProfileId === profile.id}
                highContrast
                size="1"
              >
                Unblock
              </Button>
            </div>
          </div>
          <div className="p-2 pl-4 pt-2.5">
            <Link
              href={`/u/${getProfile(profile)?.slug}`}
              className="flex items-center space-x-1"
            >
              <span className="text-2xl font-semibold leading-tight">
                {getProfile(profile)?.slug}
              </span>
              <Badge id={profile?.id} size="lg" />
            </Link>
            {profile.metadata?.bio && (
              <div className="line-clamp-1 py-2">
                <InterweaveContent content={profile.metadata?.bio} />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default List
