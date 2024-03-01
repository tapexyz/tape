import HoverableProfile from '@components/Common/HoverableProfile'
import {
  getProfile,
  getProfilePicture,
  getPublicationData
} from '@dragverse/generic'
import type { MirrorNotification, ProfileMirrorResult } from '@dragverse/lens'
import { MirrorOutline } from '@dragverse/ui'
import Link from 'next/link'
import type { FC } from 'react'

type Props = {
  notification: MirrorNotification
}

const Mirrored: FC<Props> = ({ notification: { mirrors, publication } }) => {
  return (
    <span className="flex space-x-4">
      <div className="p-1">
        <MirrorOutline className="size-5" />
      </div>
      <div>
        <span className="flex -space-x-1.5">
          {mirrors.slice(0, 30).map(({ profile }: ProfileMirrorResult) => (
            <HoverableProfile profile={profile} key={profile?.id}>
              <img
                className="size-7 rounded-full border dark:border-gray-700/80"
                src={getProfilePicture(profile, 'AVATAR')}
                draggable={false}
                alt={getProfile(profile)?.displayName}
              />
            </HoverableProfile>
          ))}
        </span>
        <div className="py-2">mirrored your publication</div>
        <Link
          href={`/watch/${publication.id}`}
          className="text-dust line-clamp-2 font-medium"
        >
          {getPublicationData(publication.metadata)?.content}
        </Link>
      </div>
    </span>
  )
}

export default Mirrored
