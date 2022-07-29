import React, { FC } from 'react'
import { AiFillLike, AiOutlineLike } from 'react-icons/ai'

type Props = {
  iconType?: string
  className?: string
}

export const LikeButton: FC<Props> = ({ iconType, className }) => {
  switch (iconType) {
    case 'filled':
      return <AiFillLike className={className} />
    default:
      return <AiOutlineLike className={className} />
  }
}
