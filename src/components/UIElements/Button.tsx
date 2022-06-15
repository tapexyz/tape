import clsx from 'clsx'
import React, {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  forwardRef,
  ReactNode
} from 'react'

import { Loader } from './Loader'

interface Props
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'secondary' | 'danger'
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
        'relative inline-block disabled:opacity-50 rounded-xl group',
        {
          'px-4 py-2 text-xs': size === 'sm',
          'px-5 py-2 text-sm': size === 'md',
          'px-6 py-3 text-base': size === 'lg'
        },
        className
      )}
      disabled={loading}
      {...rest}
    >
      <span
        className={clsx(
          'absolute focus:outline-none inset-0 w-full h-full transition duration-200 ease-in-out transform rounded-xl',
          {
            'border border-indigo-500': variant === 'primary',
            'bg-transparent': variant === 'secondary',
            'border-red-500 border': variant === 'danger',
            'group-hover:translate-x-0.5 group-hover:translate-y-0.5':
              !rest.disabled
          }
        )}
      ></span>
      <span
        className={clsx('absolute inset-0 w-full h-full rounded-xl', {
          'bg-indigo-500 border border-indigo-500': variant === 'primary',
          'bg-transparent': variant === 'secondary',
          'bg-red-500 border border-red-500': variant === 'danger'
        })}
      ></span>
      <span
        className={clsx('relative flex items-center justify-center space-x-2', {
          'text-white': variant !== 'secondary'
        })}
      >
        {icon}
        {loading && <Loader size="sm" />}
        <span className="font-medium whitespace-nowrap">{children}</span>
      </span>
    </button>
  )
})
