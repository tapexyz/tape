import type { FC, ReactNode } from 'react'

import clsx from 'clsx'
import React from 'react'

type Props = {
  children: ReactNode
  className?: string
  variant?: 'danger' | 'success' | 'warning'
}

const Alert: FC<Props> = ({ children, className, variant = 'warning' }) => {
  return (
    <div
      className={clsx('flex items-center rounded-xl border p-4', className, {
        'border-green-500 border-opacity-50': variant === 'success',
        'border-red-500 border-opacity-50': variant === 'danger',
        'border-yellow-500 border-opacity-50': variant === 'warning'
      })}
    >
      {children}
    </div>
  )
}

export default Alert
