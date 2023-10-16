import Badge from '@components/Common/Badge'
import Stats from '@components/Profile/BasicInfo/Stats'
import useChannelStore from '@lib/store/channel'
import { Avatar, Flex } from '@radix-ui/themes'
import { getProfilePicture, trimLensHandle } from '@tape.xyz/generic'
import React from 'react'
import Custom404 from 'src/pages/404'

import Delete from './Delete'
import Guardian from './Guardian'

const DangerZone = () => {
  const activeChannel = useChannelStore((state) => state.activeChannel)

  if (!activeChannel) {
    return <Custom404 />
  }

  return (
    <div className="dark:bg-bunker tape-border rounded-medium mb-4 divide-y bg-white p-5 dark:divide-gray-800">
      <Flex align="center" justify="between" mb="6">
        <div className="flex items-center">
          <div className="mr-3 mt-0.5 flex-none">
            <Avatar
              src={getProfilePicture(activeChannel, 'AVATAR')}
              fallback={trimLensHandle(activeChannel?.handle)[0]}
              radius="full"
              className="h-9 w-9 rounded-full"
              draggable={false}
              alt={activeChannel?.handle}
            />
          </div>
          <div className="flex flex-col">
            {activeChannel.metadata?.displayName && (
              <h6 className="font-medium">
                {activeChannel.metadata?.displayName}
              </h6>
            )}
            <span className="flex items-center space-x-1">
              <span className="text-sm">{activeChannel?.handle}</span>
              <Badge id={activeChannel?.id} size="xs" />
            </span>
          </div>
        </div>
        <div className="flex space-x-2">
          <Stats profile={activeChannel} />
        </div>
      </Flex>
      <Guardian />
      <Delete />
    </div>
  )
}

export default DangerZone
