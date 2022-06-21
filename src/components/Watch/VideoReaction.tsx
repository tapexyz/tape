import { useMutation } from '@apollo/client'
import { Button } from '@components/UIElements/Button'
import useAppStore from '@lib/store'
import usePersistStore from '@lib/store/persist'
import { SIGN_IN_REQUIRED_MESSAGE } from '@utils/constants'
import {
  ADD_REACTION_MUTATION,
  REMOVE_REACTION_MUTATION
} from '@utils/gql/queries'
import clsx from 'clsx'
import React, { FC, useState } from 'react'
import toast from 'react-hot-toast'
import { AiOutlineDislike, AiOutlineLike } from 'react-icons/ai'
import { LenstubePublication } from 'src/types/local'

type Props = {
  video: LenstubePublication
}

const VideoReaction: FC<Props> = ({ video }) => {
  const { selectedChannel } = useAppStore()
  const { isAuthenticated } = usePersistStore()

  const [reaction, setReaction] = useState({
    isLiked: video.reaction === 'UPVOTE',
    isDisliked: video.reaction === 'DOWNVOTE',
    likeCount: video.stats.totalUpvotes,
    dislikeCount: video.stats.totalDownvotes
  })

  const [addReaction] = useMutation(ADD_REACTION_MUTATION, {
    onError(error) {
      toast.error(error.message)
    }
  })
  const [removeReaction] = useMutation(REMOVE_REACTION_MUTATION, {
    onError(error) {
      toast.error(error.message)
    }
  })

  const likeVideo = () => {
    if (!isAuthenticated) return toast.error(SIGN_IN_REQUIRED_MESSAGE)
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
            publicationId: video.id
          }
        }
      })
    } else {
      addReaction({
        variables: {
          request: {
            profileId: selectedChannel?.id,
            reaction: 'UPVOTE',
            publicationId: video.id
          }
        }
      })
    }
  }

  const dislikeVideo = () => {
    if (!isAuthenticated) return toast.error(SIGN_IN_REQUIRED_MESSAGE)
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
            publicationId: video.id
          }
        }
      })
    } else {
      addReaction({
        variables: {
          request: {
            profileId: selectedChannel?.id,
            reaction: 'DOWNVOTE',
            publicationId: video.id
          }
        }
      })
    }
  }

  return (
    <div className="flex items-center justify-end space-x-4">
      <Button variant="secondary" className="!p-0" onClick={() => likeVideo()}>
        <span
          className={clsx('flex items-center space-x-1 outline-none', {
            'text-indigo-500 font-semibold': reaction.isLiked
          })}
        >
          <AiOutlineLike />
          <span>{reaction.likeCount > 0 ? reaction.likeCount : 'Like'}</span>
        </span>
      </Button>
      <Button
        variant="secondary"
        className="!p-0"
        onClick={() => dislikeVideo()}
      >
        <span
          className={clsx('flex items-center space-x-1 outline-none', {
            'text-indigo-500 font-semibold': reaction.isDisliked
          })}
        >
          <AiOutlineDislike />
          <span>
            {reaction.dislikeCount > 0 ? reaction.dislikeCount : 'Dislike'}
          </span>
        </span>
      </Button>
    </div>
  )
}

export default VideoReaction
