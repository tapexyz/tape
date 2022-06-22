import InterweaveContent from '@components/Common/InterweaveContent'
import Tooltip from '@components/UIElements/Tooltip'
import { checkValueInAttributes } from '@utils/functions/getFromAttributes'
import getProfilePicture from '@utils/functions/getProfilePicture'
import clsx from 'clsx'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import dynamic from 'next/dynamic'
import React, { FC, useEffect, useState } from 'react'
import { AiFillHeart } from 'react-icons/ai'
import { BiChevronDown, BiChevronUp } from 'react-icons/bi'
import { Attribute } from 'src/types'
import { LenstubePublication } from 'src/types/local'
dayjs.extend(relativeTime)

const ImageAttachments = dynamic(() => import('../Common/ImageAttachments'))

interface Props {
  comment: LenstubePublication
  hideType?: boolean
}

const Comment: FC<Props> = ({ comment }) => {
  const [clamped, setClamped] = useState(false)
  const [showMore, setShowMore] = useState(false)

  useEffect(() => {
    if (comment?.metadata?.content.trim().length > 100) {
      setClamped(true)
      setShowMore(true)
    }
  }, [comment?.metadata?.content])

  return (
    <div className="flex items-start w-full">
      <div className="flex-none mr-3">
        <img
          src={getProfilePicture(comment.profile)}
          className="w-8 h-8 rounded-xl"
          draggable={false}
          alt=""
        />
      </div>
      <div className="flex flex-col items-start mr-2">
        <span className="flex items-center mb-1 space-x-2">
          <h1 className="text-sm font-medium">{comment?.profile.handle}</h1>
          {checkValueInAttributes(
            comment?.metadata.attributes as Attribute[],
            'tip'
          ) && (
            <Tooltip placement="top" content="Tipper">
              <span>
                <AiFillHeart className="text-xs text-pink-500" />
              </span>
            </Tooltip>
          )}
          <span className="inline-flex items-center opacity-60 space-x-1 text-[10px]">
            {dayjs(new Date(comment?.createdAt)).fromNow()}
          </span>
        </span>
        <p
          className={clsx('mt-2 text-sm opacity-80', {
            'line-clamp-2': clamped,
            '': !clamped
          })}
        >
          <InterweaveContent content={comment?.metadata?.content} />
        </p>
        {showMore && (
          <button
            onClick={() => setClamped(!clamped)}
            className="flex items-center mt-2 text-xs outline-none hover:opacity-100 opacity-60"
          >
            {clamped ? (
              <>
                Show more <BiChevronDown className="text-sm" />
              </>
            ) : (
              <>
                Show less <BiChevronUp className="text-sm" />
              </>
            )}
          </button>
        )}
        <span className="mt-1">
          <ImageAttachments attachments={comment?.metadata?.media} />
        </span>
      </div>
    </div>
  )
}

export default Comment
