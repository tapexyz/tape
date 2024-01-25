import { tw } from '@tape.xyz/browser'
import type { HTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

interface Props extends HTMLAttributes<HTMLSpanElement> {
  size?: 'sm' | 'md' | 'lg'
}

export const Badge = forwardRef<HTMLSpanElement, Props>(
  ({ children, className, size = 'sm', ...props }, ref) => {
    const sizeClasses = {
      'px-2 py-0.5 text-xs': size === 'sm',
      'px-2 py-1 text-sm': size === 'md',
      'px-3 py-1.5 text-base': size === 'lg'
    }

    return (
      <span
        ref={ref}
        className={tw(
          sizeClasses,
          'rounded-full bg-gray-200 font-medium dark:bg-gray-800',
          className
        )}
        {...props}
      >
        {children}
      </span>
    )
  }
)

Badge.displayName = 'Badge'
