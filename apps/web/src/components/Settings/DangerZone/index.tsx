import Stats from '@components/Channel/BasicInfo/Stats'
import Badge from '@components/Common/Badge'
import useChannelStore from '@lib/store/channel'
import { Avatar, Card, Flex } from '@radix-ui/themes'
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
    <div className="rounded-lg bg-white dark:divide-gray-900 dark:bg-black">
      <Card size="3" className="mb-4">
        <Flex align="center" justify="between">
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
      </Card>
      <Guardian />
      <Delete />
    </div>
  )
}

export default DangerZone
