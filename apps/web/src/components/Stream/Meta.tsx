import ExternalOutline from '@components/Common/Icons/ExternalOutline'
import { getShortHandTime } from '@lib/formatTime'
import { Analytics, TRACK } from '@tape.xyz/browser'
import { STATIC_ASSETS } from '@tape.xyz/constants'
import Link from 'next/link'
import React from 'react'

const Meta = ({ live, channel }: any) => {
  const { name, updatedAt, description } = live

  return (
    <div className="py-1">
      <div className="flex items-center justify-between space-x-2.5">
        <div className="w-3/4">
          <div className="flex w-full min-w-0 items-start justify-between space-x-1.5">
            <div className="ultrawide:break-all line-clamp-2 break-words text-xl font-bold">
              {name}
            </div>
          </div>
          <p className="line-clamp-1">{description}</p>
        </div>
        <div className="flex items-center overflow-hidden pt-6 opacity-70">
          <span>{channel}</span>
          <span className="middot" />
          {updatedAt && (
            <span className="whitespace-nowrap">
              {getShortHandTime(updatedAt)}
            </span>
          )}
          <span className="middot" />
          <Link
            onClick={() => Analytics.track(TRACK.OPEN_ACTIONS.OPEN_IN_UNLONELY)}
            href={`https://www.unlonely.app/channels/${channel}`}
            target="_blank"
            className="flex items-center space-x-1 font-medium hover:text-indigo-500"
          >
            <img
              src={`${STATIC_ASSETS}/images/unlonely.png`}
              alt=""
              className="h-5 w-5 rounded-lg"
            />
            <span>Unlonely</span>
            <ExternalOutline className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Meta
