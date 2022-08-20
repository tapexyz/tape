import clsx from 'clsx'
import React, {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  forwardRef,
  ReactNode
} from 'react'

import { Loader } from './Loader'

export type ButtonVariants = 'primary' | 'secondary' | 'danger' | 'outlined'

interface Props
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: ButtonVariants
  loading?: boolean
  children?: ReactNode
  icon?: ReactNode
  className?: string
}

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  {
    className = '',
    size = 'md',
    variant = 'primary',
    loading,
    children,
    icon,
    ...rest
  },
  ref
) {
  return (
    <button
      ref={ref}
      className={clsx(
        'relative inline-block disabled:opacity-50 rounded-lg md:rounded-xl group',
        {
          'px-4 py-1.5 text-xs': size === 'sm',
          'px-5 md:py-2 py-1.5 text-sm': size === 'md',
          'px-6 py-3 text-base': size === 'lg',
          'px-8 py-4 text-lg': size === 'xl'
        },
        className
      )}
      disabled={loading}
      {...rest}
    >
      <span
        className={clsx(
          'absolute focus:outline-none inset-0 w-full h-full transition duration-200 ease-in-out transform rounded-lg md:rounded-xl',
          {
            'border border-indigo-500': variant === 'primary',
            'bg-transparent': variant === 'secondary',
            'bg-transparent !transition-none group-hover:border group-hover:border-indigo-500':
              variant === 'outlined',
            'border-red-500 border': variant === 'danger',
            'group-hover:translate-x-0.5 group-hover:translate-y-0.5':
              !rest.disabled && variant !== 'outlined'
          }
        )}
      />
      <span
        className={clsx('absolute inset-0 w-full h-full rounded-lg', {
          'bg-indigo-500 border border-indigo-500 md:rounded-xl':
            variant === 'primary',
          'bg-transparent md:rounded-xl': variant === 'secondary',
          'bg-red-500 border border-red-500 md:rounded-xl':
            variant === 'danger',
          'md:rounded-lg': size === 'sm'
        })}
      />
      <span
        className={clsx('relative flex items-center justify-center space-x-2', {
          'text-white': variant !== 'secondary' && variant !== 'outlined'
        })}
      >
        {icon}
        {loading && <Loader size="sm" />}
        <span
          className={clsx('whitespace-nowrap', {
            'font-medium': variant !== 'secondary'
          })}
        >
          {children}
        </span>
      </span>
    </button>
  )
})
