import InterweaveContent from '@components/Common/InterweaveContent'
import IsVerified from '@components/Common/IsVerified'
import HashExplorerLink from '@components/Common/Links/HashExplorerLink'
import Tooltip from '@components/UIElements/Tooltip'
import {
  checkValueInAttributes,
  getValueFromTraitType
} from '@utils/functions/getFromAttributes'
import getProfilePicture from '@utils/functions/getProfilePicture'
import clsx from 'clsx'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import React, { FC, useEffect, useState } from 'react'
import { AiFillHeart } from 'react-icons/ai'
import { BiChevronDown, BiChevronUp } from 'react-icons/bi'
import { Attribute } from 'src/types'
import { LenstubePublication } from 'src/types/local'

dayjs.extend(relativeTime)

const CommentOptions = dynamic(() => import('./CommentOptions'))
const PublicationReaction = dynamic(() => import('./PublicationReaction'))

interface Props {
  comment: LenstubePublication
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
    <div className="flex items-start justify-between group">
      <div className="flex items-start justify-between">
        <Link
          href={`/${comment.profile?.handle}`}
          className="flex-none mr-3 mt-0.5"
        >
          <img
            src={getProfilePicture(comment.profile, 'avatar')}
            className="rounded-lg w-7 h-7"
            draggable={false}
            alt="channel picture"
          />
        </Link>
        <div className="flex flex-col items-start mr-2">
          <span className="flex items-center mb-1 space-x-1">
            <Link
              href={`/${comment.profile?.handle}`}
              className="flex items-center space-x-1 text-sm font-medium"
            >
              <span>{comment?.profile?.handle}</span>
              <IsVerified id={comment?.profile.id} />
            </Link>
            {checkValueInAttributes(
              comment?.metadata.attributes as Attribute[],
              'tip'
            ) && (
              <Tooltip placement="top" content="Tipper">
                <span>
                  <HashExplorerLink
                    hash={
                      getValueFromTraitType(
                        comment?.metadata.attributes as Attribute[],
                        'hash'
                      ) || ''
                    }
                  >
                    <AiFillHeart className="text-sm text-pink-500" />
                  </HashExplorerLink>
                </span>
              </Tooltip>
            )}
            <span className="inline-flex items-center opacity-70 space-x-1 text-[10px]">
              {dayjs(new Date(comment?.createdAt)).fromNow()}
            </span>
          </span>
          <p
            className={clsx('text-sm opacity-80', {
              'line-clamp-2': clamped,
              '': !clamped
            })}
          >
            {comment?.hidden ? (
              <span className="text-xs italic opacity-80">
                Comment deleted by user!
              </span>
            ) : (
              <InterweaveContent content={comment?.metadata?.content} />
            )}
          </p>
          {showMore && (
            <div className="inline-flex mt-3">
              <button
                type="button"
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
            </div>
          )}
          {!comment.hidden && (
            <div className="mt-1">
              <PublicationReaction iconSize="xs" publication={comment} />
            </div>
          )}
        </div>
      </div>
      <div>
        <CommentOptions comment={comment} />
      </div>
    </div>
  )
}

export default Comment
