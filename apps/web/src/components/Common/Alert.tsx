import clsx from 'clsx'
import type { FC, ReactNode } from 'react'
import React from 'react'

type Props = {
  children: ReactNode
  variant?: 'warning' | 'danger' | 'success'
}

const Alert: FC<Props> = ({ children, variant = 'warning' }) => {
  return (
    <div
      className={clsx('flex items-center rounded-xl border p-4', {
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
