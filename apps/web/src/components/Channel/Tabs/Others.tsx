import HashtagOutline from '@components/Common/Icons/HashtagOutline'
import LocationOutline from '@components/Common/Icons/LocationOutline'
import UserOutline from '@components/Common/Icons/UserOutline'
import WalletOutline from '@components/Common/Icons/WalletOutline'
import AddressExplorerLink from '@components/Common/Links/AddressExplorerLink'
import Tooltip from '@components/UIElements/Tooltip'
import { getValueFromKeyInAttributes, shortenAddress } from '@lenstube/generic'
import type { Attribute, Profile } from '@lenstube/lens'
import Link from 'next/link'
import type { FC } from 'react'
import React from 'react'

type Props = {
  channel: Profile
}

const Others: FC<Props> = ({ channel }) => {
  const attributes = channel?.attributes as Attribute[]

  return (
    <div className="space-y-1.5 p-4">
      {getValueFromKeyInAttributes(attributes, 'location') && (
        <div className="flex items-center space-x-1.5">
          <LocationOutline className="h-4 w-4" />
          <span>{getValueFromKeyInAttributes(attributes, 'location')}</span>
        </div>
      )}

      <div className="flex items-center space-x-1.5">
        <HashtagOutline className="h-4 w-4" />
        <Tooltip
          content={`Profile Id - ${parseInt(channel.id)}`}
          placement="right"
        >
          <span>{channel.id}</span>
        </Tooltip>
      </div>
      <div className="flex items-center space-x-1.5">
        <WalletOutline className="h-4 w-4" />
        <AddressExplorerLink address={channel.ownedBy}>
          <span>{shortenAddress(channel.ownedBy)}</span>
        </AddressExplorerLink>
      </div>
      {channel.invitedBy && (
        <div className="flex items-center space-x-1.5">
          <UserOutline className="h-4 w-4" />
          <span>
            Invited by{' '}
            <Link
              className="hover:text-indigo-500"
              href={`/channel/${channel.invitedBy.handle}`}
            >
              @{channel.invitedBy.handle}
            </Link>
          </span>
        </div>
      )}
    </div>
  )
}

export default Others
