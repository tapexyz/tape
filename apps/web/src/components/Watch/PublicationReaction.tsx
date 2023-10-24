import HeartOutline from '@components/Common/Icons/HeartOutline'
import useAuthPersistStore from '@lib/store/auth'
import { t } from '@lingui/macro'
import { Button } from '@radix-ui/themes'
import { SIGN_IN_REQUIRED } from '@tape.xyz/constants'
import {
  Analytics,
  formatNumber,
  getPublication,
  TRACK
} from '@tape.xyz/generic'
import type { AnyPublication } from '@tape.xyz/lens'
import {
  PublicationReactionType,
  useAddReactionMutation,
  useRemoveReactionMutation
} from '@tape.xyz/lens'
import clsx from 'clsx'
import type { FC } from 'react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

type Props = {
  publication: AnyPublication
  iconSize?: 'sm' | 'base' | 'lg'
  textSize?: 'sm' | 'base'
  isVertical?: boolean
  showLabel?: boolean
  className?: string
  variant?: 'ghost' | 'surface'
}

const PublicationReaction: FC<Props> = ({
  publication,
  iconSize = 'sm',
  textSize = 'sm',
  isVertical = false,
  showLabel = true,
  variant = 'ghost',
  className
}) => {
  const targetPublication = getPublication(publication)

  const selectedSimpleProfile = useAuthPersistStore(
    (state) => state.selectedSimpleProfile
  )

  const [reaction, setReaction] = useState({
    isLiked: targetPublication.operations.hasReacted,
    likeCount: targetPublication.stats?.reactions
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
    if (!selectedSimpleProfile?.id) {
      return toast.error(SIGN_IN_REQUIRED)
    }
    setReaction((prev) => ({
      likeCount: prev.isLiked ? prev.likeCount - 1 : prev.likeCount + 1,
      isLiked: !prev.isLiked
    }))
    if (reaction.isLiked) {
      removeReaction({
        variables: {
          request: {
            for: publication.id,
            reaction: PublicationReactionType.Upvote
          }
        }
      })
    } else {
      Analytics.track(TRACK.PUBLICATION.LIKE)
      addReaction({
        variables: {
          request: {
            for: publication.id,
            reaction: PublicationReactionType.Upvote
          }
        }
      })
    }
  }

  return (
    <Button
      variant={variant}
      className={className}
      highContrast
      onClick={() => likeVideo()}
    >
      <span
        className={clsx(
          'flex items-center focus:outline-none',
          isVertical ? 'flex-col space-y-1' : 'space-x-1',
          {
            'text-brand-400': reaction.isLiked
          }
        )}
      >
        <HeartOutline
          className={clsx({
            'h-3.5 w-3.5': iconSize === 'sm',
            'h-6 w-6': iconSize === 'lg',
            'h-4 w-4': iconSize === 'base',
            'text-brand-400': reaction.isLiked
          })}
        />
        {showLabel && (
          <span
            className={clsx({
              'text-xs': textSize === 'sm',
              'text-base': textSize === 'base',
              'text-brand-400': reaction.isLiked
            })}
          >
            {reaction.likeCount > 0
              ? formatNumber(reaction.likeCount)
              : t`Like`}
          </span>
        )}
      </span>
    </Button>
  )
}

export default PublicationReaction
