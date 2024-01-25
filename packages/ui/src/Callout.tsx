import { tw } from '@tape.xyz/browser'
import type { FC, ReactNode } from 'react'
import React from 'react'

type Props = {
  variant?: 'primary' | 'secondary' | 'danger'
  children: ReactNode
  icon?: ReactNode
  className?: string
}

export const Callout: FC<Props> = ({
  children,
  className,
  icon,
  variant = 'primary'
}) => {
  const variantClasses = {
    'bg-brand-100 dark:bg-brand-900': variant === 'primary',
    'border-gray-200 border dark:border-gray-800': variant === 'secondary',
    'bg-red-100 dark:bg-red-900': variant === 'danger'
  }

  return (
    <div
      className={tw(
        variantClasses,
        'flex space-x-2 rounded-lg p-3 text-sm font-medium',
        className
      )}
    >
      <span className="m-1 flex-none">{icon}</span>
      <span className="w-full self-center opacity-70">{children}</span>
    </div>
  )
}
