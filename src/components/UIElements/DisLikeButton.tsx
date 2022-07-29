import React, { FC } from 'react'
import { AiFillDislike, AiOutlineDislike } from 'react-icons/ai'

type Props = {
  iconType?: string
  className?: string
}

export const DisLikeButton: FC<Props> = ({ iconType, className }) => {
  switch (iconType) {
    case 'filled':
      return <AiFillDislike className={className} />
    default:
      return <AiOutlineDislike className={className} />
  }
}
