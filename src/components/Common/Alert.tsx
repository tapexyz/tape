import clsx from 'clsx'
import React, { FC, ReactNode } from 'react'

type Props = {
  children: ReactNode
  variant?: 'warning' | 'danger' | 'success'
}

const Alert: FC<Props> = ({ children, variant = 'warning' }) => {
  return (
    <div
      className={clsx('border rounded-xl text-sm p-4', {
        'border-yellow-500 border-opacity-50': variant === 'warning'
      })}
    >
      {children}
    </div>
  )
}

export default Alert
