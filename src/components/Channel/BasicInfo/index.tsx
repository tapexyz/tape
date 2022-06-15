import { useQuery } from '@apollo/client'
import { Button } from '@components/UIElements/Button'
import Tooltip from '@components/UIElements/Tooltip'
import { PencilAltIcon } from '@heroicons/react/outline'
import useAppStore from '@lib/store'
import getCoverPicture from '@utils/functions/getCoverPicture'
import getProfilePicture from '@utils/functions/getProfilePicture'
import imageCdn from '@utils/functions/imageCdn'
import { DOES_FOLLOW } from '@utils/gql/queries'
import { SETTINGS } from '@utils/url-path'
import { useRouter } from 'next/router'
import React, { FC } from 'react'
import { Profile } from 'src/types'

import JoinChannel from './JoinChannel'
import Subscribe from './Subscribe'
import UnSubscribe from './UnSubscribe'

type Props = {
  channel: Profile & any
}

const BasicInfo: FC<Props> = ({ channel }) => {
  const router = useRouter()
  const { selectedChannel } = useAppStore()
  const { data } = useQuery(DOES_FOLLOW, {
    variables: {
      request: {
        followInfos: {
          followerAddress: selectedChannel?.ownedBy,
          profileId: channel?.id
        }
      }
    },
    skip: !selectedChannel || !channel?.id
  })

  const subscribeType = channel?.followModule?.__typename
  const isFollower = data?.doesFollow[0].follows as boolean

  const onClickCustomize = () => {
    router.push(SETTINGS)
  }

  return (
    <div className="flex">
      <div className="relative w-full">
        <span>
          <div
            style={{
              backgroundImage: `url(${imageCdn(getCoverPicture(channel))})`
            }}
            className="absolute w-full bg-white bg-center bg-no-repeat bg-cover rounded-lg dark:bg-gray-900 -z-10 h-44 md:h-72"
          />
        </span>
        <div className="flex items-center pt-2 md:pt-0 md:pl-4 mt-44 md:mt-72">
          <div className="flex-none mr-4 md:mr-6">
            <img
              src={getProfilePicture(channel)}
              alt=""
              className="bg-white border-2 rounded-full dark:bg-gray-900 w-14 h-14 md:-mt-10 md:w-32 md:h-32"
              draggable={false}
            />
          </div>
          <div className="flex flex-wrap justify-between flex-1 py-2 space-y-2">
            <div className="flex flex-col items-start mr-3">
              <h1 className="font-bold md:text-xl">{channel?.handle}</h1>
              <span className="inline-flex items-center space-x-1 text-sm md:text-base">
                {channel?.stats.totalFollowers} subscribers
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {channel?.id === selectedChannel?.id && (
                <Tooltip content="Customize Channel" placement="top">
                  <Button
                    variant="secondary"
                    onClick={() => onClickCustomize()}
                    className="!p-2"
                  >
                    <PencilAltIcon className="w-5 h-5" />
                  </Button>
                </Tooltip>
              )}
              {isFollower ? (
                <UnSubscribe channel={channel} />
              ) : subscribeType === 'FeeFollowModuleSettings' ? (
                <JoinChannel channel={channel} />
              ) : (
                <Subscribe channel={channel} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BasicInfo
