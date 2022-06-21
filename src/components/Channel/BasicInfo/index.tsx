import SubscribeActions from '@components/Common/SubscribeActions'
import { Button } from '@components/UIElements/Button'
import Tooltip from '@components/UIElements/Tooltip'
import usePersistStore from '@lib/store/persist'
import getCoverPicture from '@utils/functions/getCoverPicture'
import getProfilePicture from '@utils/functions/getProfilePicture'
import imageCdn from '@utils/functions/imageCdn'
import { SETTINGS } from '@utils/url-path'
import { useRouter } from 'next/router'
import React, { FC } from 'react'
import { AiOutlineEdit } from 'react-icons/ai'
import { Profile } from 'src/types'

type Props = {
  channel: Profile & any
}

const BasicInfo: FC<Props> = ({ channel }) => {
  const router = useRouter()
  const { selectedChannel } = usePersistStore()

  const subscribeType = channel?.followModule?.__typename

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
              className="object-cover w-24 h-24 bg-white border-4 border-white dark:border-black rounded-xl dark:bg-gray-900 md:-mt-10 md:w-32 md:h-32"
              draggable={false}
              alt=""
            />
          </div>
          <div className="flex flex-wrap justify-between flex-1 py-2 space-y-2">
            <div className="flex flex-col items-start mr-3">
              <h1 className="font-bold md:text-xl">
                {channel.name ?? channel?.handle}
              </h1>
              <span className="inline-flex items-center space-x-1 text-sm md:text-base">
                {channel?.stats.totalFollowers} subscribers
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {channel?.id === selectedChannel?.id && (
                <Tooltip content="Customize Channel" placement="top">
                  <Button
                    variant="outlined"
                    onClick={() => onClickCustomize()}
                    className="!p-2 md:!p-2.5"
                  >
                    <AiOutlineEdit className="text-lg" />
                  </Button>
                </Tooltip>
              )}
              <SubscribeActions
                channel={channel}
                subscribeType={subscribeType}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BasicInfo
