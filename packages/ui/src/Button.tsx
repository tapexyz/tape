import { tw } from '@tape.xyz/browser'
import type { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from 'react'
import { forwardRef } from 'react'

import LoadingBorder from './LoadingBorder'

interface ButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  icon?: ReactNode
  outline?: boolean
  loading?: boolean
  className?: string
  children?: ReactNode
  size?: 'xs' | 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'secondary' | 'danger'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      size = 'sm',
      variant = 'primary',
      loading,
      icon,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      'px-2 py-1 text-xs': size === 'xs',
      'px-4 py-1.5 text-sm': size === 'sm',
      'px-6 py-3 text-sm': size === 'md',
      'px-8 py-4 text-base': size === 'lg'
    }
    const variantClasses = {
      'hover:bg-gray-700 border border-transparent bg-gray-800 text-gray-100 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-gray-200':
        variant === 'primary',
      'border border-gray-200 dark:border-gray-800 dark:hover:bg-gray-800 hover:bg-gray-100 bg-white dark:bg-black':
        variant === 'secondary',
      'hover:bg-red-500 dark:hover:bg-red-500 border border-transparent bg-red-600 text-white dark:bg-red-700 dark:text-white':
        variant === 'danger'
    }

    return (
      <div className="relative">
        {loading && (
          <div className="absolute -inset-[2px] overflow-hidden rounded-lg">
            <LoadingBorder rx="30%" ry="30%">
              <div
                className={tw(
                  'rounded-full bg-red-400 blur',
                  size === 'sm' ? 'h-10 w-10' : 'h-20 w-20'
                )}
              />
            </LoadingBorder>
          </div>
        )}
        <div className="z-[1]">
          <button
            ref={ref}
            className={tw(
              sizeClasses,
              variantClasses,
              'relative flex w-full scale-100 appearance-none items-center space-x-1.5 rounded-lg font-semibold transition-colors duration-150 active:scale-[0.98] disabled:pointer-events-none',
              className
            )}
            {...props}
          >
            {icon}
            <div className="w-full">{children}</div>
          </button>
        </div>
      </div>
    )
  }
)

Button.displayName = 'Button'
