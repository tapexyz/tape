import DislikeOutline from '@components/Common/Icons/DislikeOutline'
import LikeOutline from '@components/Common/Icons/LikeOutline'
import useAppStore from '@lib/store'
import usePersistStore from '@lib/store/persist'
import clsx from 'clsx'
import type { Publication } from 'lens'
import {
  ReactionTypes,
  useAddReactionMutation,
  useRemoveReactionMutation
} from 'lens'
import type { FC } from 'react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { Analytics, SIGN_IN_REQUIRED_MESSAGE, TRACK } from 'utils'
import { formatNumber } from 'utils/functions/formatNumber'

type Props = {
  publication: Publication
  iconSize?: 'sm' | 'base' | 'lg'
  textSize?: 'sm' | 'base'
  isVertical?: boolean
  showLabel?: boolean
}

const PublicationReaction: FC<Props> = ({
  publication,
  iconSize = 'sm',
  textSize = 'sm',
  isVertical = false,
  showLabel = true
}) => {
  const selectedChannelId = usePersistStore((state) => state.selectedChannelId)
  const selectedChannel = useAppStore((state) => state.selectedChannel)

  const [reaction, setReaction] = useState({
    isLiked: publication.reaction === 'UPVOTE',
    isDisliked: publication.reaction === 'DOWNVOTE',
    likeCount: publication.stats?.totalUpvotes
  })

  const [addReaction] = useAddReactionMutation({
    onError: (error) => {
      toast.error(error?.message)
    }
  })
  const [removeReaction] = useRemoveReactionMutation({
    onError: (error) => {
      toast.error(error?.message)
    }
  })

  const likeVideo = () => {
    if (!selectedChannelId) return toast.error(SIGN_IN_REQUIRED_MESSAGE)
    Analytics.track(TRACK.LIKE_VIDEO)
    setReaction((prev) => ({
      likeCount: prev.isLiked ? prev.likeCount - 1 : prev.likeCount + 1,
      isLiked: !prev.isLiked,
      isDisliked: false
    }))
    if (reaction.isLiked) {
      removeReaction({
        variables: {
          request: {
            profileId: selectedChannel?.id,
            reaction: ReactionTypes.Upvote,
            publicationId: publication.id
          }
        }
      })
    } else {
      addReaction({
        variables: {
          request: {
            profileId: selectedChannel?.id,
            reaction: ReactionTypes.Upvote,
            publicationId: publication.id
          }
        }
      })
    }
  }

  const dislikeVideo = () => {
    if (!selectedChannelId) return toast.error(SIGN_IN_REQUIRED_MESSAGE)
    Analytics.track(TRACK.DISLIKE_VIDEO)
    setReaction((prev) => ({
      likeCount: prev.isLiked ? prev.likeCount - 1 : prev.likeCount,
      isLiked: false,
      isDisliked: !prev.isDisliked
    }))
    if (reaction.isDisliked) {
      removeReaction({
        variables: {
          request: {
            profileId: selectedChannel?.id,
            reaction: ReactionTypes.Downvote,
            publicationId: publication.id
          }
        }
      })
    } else {
      addReaction({
        variables: {
          request: {
            profileId: selectedChannel?.id,
            reaction: ReactionTypes.Downvote,
            publicationId: publication.id
          }
        }
      })
    }
  }

  return (
    <div
      className={clsx(
        'flex items-center justify-end',
        isVertical
          ? 'flex-col space-y-2.5 px-3 md:space-y-4'
          : 'space-x-2.5 md:space-x-5'
      )}
    >
      <button
        className="focus:outline-none disabled:opacity-50"
        onClick={() => likeVideo()}
      >
        <span
          className={clsx(
            'flex items-center focus:outline-none',
            isVertical ? 'flex-col space-y-2' : 'space-x-1.5',
            {
              'font-semibold text-indigo-500': reaction.isLiked
            }
          )}
        >
          <LikeOutline
            className={clsx({
              'h-3.5 w-3.5': iconSize === 'sm',
              'h-6 w-6': iconSize === 'lg',
              'h-4 w-4': iconSize === 'base',
              'text-indigo-500': reaction.isLiked
            })}
          />
          {showLabel && (
            <span
              className={clsx({
                'text-xs': textSize === 'sm',
                'text-base': textSize === 'base',
                'text-indigo-500': reaction.isLiked
              })}
            >
              {reaction.likeCount > 0
                ? formatNumber(reaction.likeCount)
                : 'Like'}
            </span>
          )}
        </span>
      </button>
      <button
        className="focus:outline-none disabled:opacity-50"
        onClick={() => dislikeVideo()}
      >
        <span
          className={clsx(
            'flex items-center focus:outline-none',
            isVertical ? 'flex-col space-y-2' : 'space-x-1.5',
            {
              'text-indigo-500': reaction.isDisliked
            }
          )}
        >
          <DislikeOutline
            className={clsx({
              'h-3.5 w-3.5': iconSize === 'sm',
              'h-6 w-6': iconSize === 'lg',
              'h-4 w-4': iconSize === 'base',
              'text-indigo-500': reaction.isDisliked
            })}
          />
          {showLabel && (
            <span
              className={clsx({
                'text-xs': textSize === 'sm',
                'text-base': textSize === 'base',
                'text-indigo-500': reaction.isDisliked
              })}
            >
              Dislike
            </span>
          )}
        </span>
      </button>
    </div>
  )
}

export default PublicationReaction
