import { VERIFIED_CHANNELS } from '@utils/data/verified'
import React, { FC } from 'react'
import { HiCheckCircle } from 'react-icons/hi'

const IsVerified: FC<{ id: string; className?: string }> = ({
  id,
  className = 'text-sm text-gray-500'
}) => {
  if (!VERIFIED_CHANNELS.includes(id)) return null
  return (
    <div>
      <HiCheckCircle className={className} />
    </div>
  )
}

export default IsVerified
