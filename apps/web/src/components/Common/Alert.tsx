import { tw } from '@tape.xyz/browser'
import type { FC, ReactNode } from 'react'
import React from 'react'

type Props = {
  children: ReactNode
  className?: string
  variant?: 'warning' | 'danger' | 'success'
}

const Alert: FC<Props> = ({ children, variant = 'warning', className }) => {
  return (
    <div
      className={tw('flex items-center rounded-xl border p-4', className, {
        'border-yellow-500 border-opacity-50': variant === 'warning',
        'border-red-500 border-opacity-50': variant === 'danger',
        'border-green-500 border-opacity-50': variant === 'success'
      })}
    >
      {children}
    </div>
  )
}

export default Alert
