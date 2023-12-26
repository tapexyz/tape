import type { AnyPublication } from '@tape.xyz/lens'
import type { FC } from 'react'

import HeartFilled from '@components/Common/Icons/HeartFilled'
import HeartOutline from '@components/Common/Icons/HeartOutline'
import useProfileStore from '@lib/store/idb/profile'
import { Button } from '@radix-ui/themes'
import { SIGN_IN_REQUIRED } from '@tape.xyz/constants'
import { EVENTS, formatNumber, getPublication, Tower } from '@tape.xyz/generic'
import {
  PublicationReactionType,
  useAddReactionMutation,
  useRemoveReactionMutation
} from '@tape.xyz/lens'
import clsx from 'clsx'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

type Props = {
  className?: string
  color?: 'blue' | 'crimson'
  iconSize?: 'base' | 'lg' | 'sm'
  isVertical?: boolean
  label?: string
  publication: AnyPublication
  textSize?: 'inherit' | 'sm'
  variant?: 'ghost' | 'soft' | 'surface'
}

const PublicationReaction: FC<Props> = ({
  className,
  color,
  iconSize = 'sm',
  isVertical = false,
  label,
  publication,
  textSize = 'sm',
  variant = 'ghost'
}) => {
  const targetPublication = getPublication(publication)

  const { activeProfile } = useProfileStore()

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
    if (!activeProfile?.id) {
      return toast.error(SIGN_IN_REQUIRED)
    }
    setReaction((prev) => ({
      isLiked: !prev.isLiked,
      likeCount: prev.isLiked ? prev.likeCount - 1 : prev.likeCount + 1
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
      addReaction({
        variables: {
          request: {
            for: publication.id,
            reaction: PublicationReactionType.Upvote
          }
        }
      })
      Tower.track(EVENTS.PUBLICATION.LIKE)
    }
  }

  return (
    <Button
      className={className}
      color={color}
      highContrast
      onClick={() => likeVideo()}
      variant={variant}
    >
      <span
        className={clsx(
          'flex items-center focus:outline-none',
          isVertical ? 'flex-col space-y-1' : 'space-x-1',
          {
            'text-red-500': reaction.isLiked
          }
        )}
      >
        {reaction.isLiked ? (
          <HeartFilled
            className={clsx({
              'size-3.5': iconSize === 'sm',
              'size-4': iconSize === 'base',
              'size-6': iconSize === 'lg'
            })}
          />
        ) : (
          <HeartOutline
            className={clsx({
              'size-3.5': iconSize === 'sm',
              'size-4': iconSize === 'base',
              'size-6': iconSize === 'lg'
            })}
          />
        )}
        {label ? (
          <span
            className={clsx({
              'text-inherit': textSize === 'inherit',
              'text-red-400': reaction.isLiked,
              'text-xs': textSize === 'sm'
            })}
          >
            {label}
          </span>
        ) : (
          <span
            className={clsx({
              'text-inherit': textSize === 'inherit',
              'text-red-400': reaction.isLiked,
              'text-xs': textSize === 'sm'
            })}
          >
            {reaction.likeCount > 0 ? formatNumber(reaction.likeCount) : 'Like'}
          </span>
        )}
      </span>
    </Button>
  )
}

export default PublicationReaction
