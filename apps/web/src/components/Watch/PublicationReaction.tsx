import DislikeOutline from '@components/Common/Icons/DislikeOutline'
import LikeOutline from '@components/Common/Icons/LikeOutline'
import { Button } from '@components/UIElements/Button'
import useAppStore from '@lib/store'
import usePersistStore from '@lib/store/persist'
import { Analytics, TRACK } from '@utils/analytics'
import { SIGN_IN_REQUIRED_MESSAGE } from '@utils/constants'
import { formatNumber } from '@utils/functions/formatNumber'
import clsx from 'clsx'
import type { FC } from 'react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import {
  ReactionTypes,
  useAddReactionMutation,
  useRemoveReactionMutation
} from 'src/types/lens'
import type { LenstubePublication } from 'src/types/local'

type Props = {
  publication: LenstubePublication
  iconSize?: 'sm' | 'lg'
  textSize?: 'sm' | 'lg'
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
    likeCount: publication.stats?.totalUpvotes,
    dislikeCount: publication.stats?.totalDownvotes
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
    setReaction((reaction) => ({
      likeCount: reaction.isLiked
        ? reaction.likeCount - 1
        : reaction.likeCount + 1,
      dislikeCount: reaction.isDisliked
        ? reaction.dislikeCount - 1
        : reaction.dislikeCount,
      isLiked: !reaction.isLiked,
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
    setReaction((reaction) => ({
      likeCount: reaction.isLiked ? reaction.likeCount - 1 : reaction.likeCount,
      dislikeCount: reaction.isDisliked
        ? reaction.dislikeCount - 1
        : reaction.dislikeCount + 1,
      isLiked: false,
      isDisliked: !reaction.isDisliked
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
          ? 'flex-col space-y-2.5 md:space-y-4 px-3'
          : 'space-x-2.5 md:space-x-4'
      )}
    >
      <Button variant="secondary" className="!p-0" onClick={() => likeVideo()}>
        <span
          className={clsx('flex items-center space-x-1 outline-none', {
            'text-indigo-500 font-semibold': reaction.isLiked,
            'flex-col space-y-1': isVertical
          })}
        >
          <LikeOutline
            className={clsx({
              'w-3.5 h-3.5': iconSize === 'sm',
              'w-6 h-6': iconSize === 'lg',
              'text-indigo-500': reaction.isLiked
            })}
          />
          {showLabel && (
            <span
              className={clsx({
                'text-xs': textSize === 'sm',
                'text-indigo-500': reaction.isLiked
              })}
            >
              {reaction.likeCount > 0
                ? formatNumber(reaction.likeCount)
                : 'Like'}
            </span>
          )}
        </span>
      </Button>
      <Button
        variant="secondary"
        className="!p-0"
        onClick={() => dislikeVideo()}
      >
        <span
          className={clsx('flex items-center space-x-1 outline-none', {
            'text-indigo-500 font-semibold': reaction.isDisliked,
            'flex-col space-y-1': isVertical
          })}
        >
          <DislikeOutline
            className={clsx({
              'w-3.5 h-3.5': iconSize === 'sm',
              'w-6 h-6': iconSize === 'lg',
              'text-indigo-500': reaction.isDisliked
            })}
          />
          {showLabel && (
            <span
              className={clsx({
                'text-xs': textSize === 'sm',
                'text-indigo-500': reaction.isDisliked
              })}
            >
              {reaction.dislikeCount > 0
                ? formatNumber(reaction.dislikeCount)
                : 'Dislike'}
            </span>
          )}
        </span>
      </Button>
    </div>
  )
}

export default PublicationReaction
