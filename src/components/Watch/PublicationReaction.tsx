import { useMutation } from '@apollo/client'
import { Button } from '@components/UIElements/Button'
import { DisLikeButton } from '@components/UIElements/DisLikeButton'
import { LikeButton } from '@components/UIElements/LikeButton'
import { ADD_REACTION_MUTATION, REMOVE_REACTION_MUTATION } from '@gql/queries'
import useAppStore from '@lib/store'
import usePersistStore from '@lib/store/persist'
import { SIGN_IN_REQUIRED_MESSAGE } from '@utils/constants'
import clsx from 'clsx'
import React, { FC, useState } from 'react'
import toast from 'react-hot-toast'
import { LenstubePublication } from 'src/types/local'

type Props = {
  publication: LenstubePublication
  iconSize?: 'xs' | 'sm' | 'xl' | '2xl'
  textSize?: 'xs' | 'sm' | 'xl' | '2xl'
  isVertical?: boolean
  showLabel?: boolean
  iconType?: string
}

const PublicationReaction: FC<Props> = ({
  publication,
  iconSize = 'sm',
  textSize = 'sm',
  isVertical = false,
  showLabel = true,
  iconType = 'outline'
}) => {
  const selectedChannelId = usePersistStore((state) => state.selectedChannelId)
  const selectedChannel = useAppStore((state) => state.selectedChannel)

  const [reaction, setReaction] = useState({
    isLiked: publication.reaction === 'UPVOTE',
    isDisliked: publication.reaction === 'DOWNVOTE',
    likeCount: publication.stats?.totalUpvotes,
    dislikeCount: publication.stats?.totalDownvotes
  })

  const [addReaction] = useMutation(ADD_REACTION_MUTATION, {
    onError(error) {
      toast.error(error?.message)
    }
  })
  const [removeReaction] = useMutation(REMOVE_REACTION_MUTATION, {
    onError(error) {
      toast.error(error?.message)
    }
  })

  const likeVideo = () => {
    if (!selectedChannelId) return toast.error(SIGN_IN_REQUIRED_MESSAGE)
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
            reaction: 'UPVOTE',
            publicationId: publication.id
          }
        }
      })
    } else {
      addReaction({
        variables: {
          request: {
            profileId: selectedChannel?.id,
            reaction: 'UPVOTE',
            publicationId: publication.id
          }
        }
      })
    }
  }

  const dislikeVideo = () => {
    if (!selectedChannelId) return toast.error(SIGN_IN_REQUIRED_MESSAGE)
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
            reaction: 'DOWNVOTE',
            publicationId: publication.id
          }
        }
      })
    } else {
      addReaction({
        variables: {
          request: {
            profileId: selectedChannel?.id,
            reaction: 'DOWNVOTE',
            publicationId: publication.id
          }
        }
      })
    }
  }

  return (
    <div
      className={clsx('flex items-center justify-end', {
        'flex-col space-y-2.5 md:space-y-4 p-1 px-3': isVertical,
        'space-x-2.5 md:space-x-4': !isVertical
      })}
    >
      <Button variant="secondary" className="!p-0" onClick={() => likeVideo()}>
        <span
          className={clsx('flex items-center space-x-1 outline-none', {
            'text-indigo-500 font-semibold': reaction.isLiked,
            'flex-col space-y-1': isVertical
          })}
        >
          <LikeButton
            iconType={iconType}
            className={clsx({
              'text-xs': iconSize === 'xs',
              'text-xl': iconSize === 'xl',
              'text-2xl': iconSize === '2xl',
              'text-white md:text-inherit': iconType === 'filled',
              'text-indigo-500': reaction.isLiked
            })}
          />
          {showLabel && (
            <span
              className={clsx({
                'text-xs': textSize === 'xs',
                'text-white md:text-inherit': iconType === 'filled',
                'text-indigo-500': reaction.isLiked
              })}
            >
              {reaction.likeCount > 0 ? reaction.likeCount : 'Like'}
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
          <DisLikeButton
            iconType={iconType}
            className={clsx({
              'text-xs': iconSize === 'xs',
              'text-xl': iconSize === 'xl',
              'text-2xl': iconSize === '2xl',
              'text-white md:text-inherit': iconType === 'filled',
              'text-indigo-500': reaction.isDisliked
            })}
          />
          {showLabel && (
            <span
              className={clsx({
                'text-xs': textSize === 'xs',
                'text-white md:text-inherit': iconType === 'filled',
                'text-indigo-500': reaction.isDisliked
              })}
            >
              {reaction.dislikeCount > 0 ? reaction.dislikeCount : 'Dislike'}
            </span>
          )}
        </span>
      </Button>
    </div>
  )
}

export default PublicationReaction
