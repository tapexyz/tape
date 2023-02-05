import clsx from 'clsx'
import type { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from 'react'
import React, { forwardRef } from 'react'

import { Loader } from './Loader'

export type ButtonVariants = 'primary' | 'hover' | 'danger'

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
        {
          'btn-primary': variant === 'primary',
          'btn-danger': variant === 'danger',
          'btn-hover': variant === 'hover'
        },
        {
          'px-4 py-1.5 text-xs': size === 'sm',
          'px-5 py-1.5 text-sm md:py-2': size === 'md',
          'px-6 py-3 text-base': size === 'lg',
          'px-8 py-4 text-lg': size === 'xl'
        },
        className
      )}
      disabled={loading}
      {...rest}
    >
      <span
        className={clsx('flex items-center justify-center space-x-2', {
          'text-white': variant !== 'hover'
        })}
      >
        {icon}
        {loading && <Loader size="sm" />}
        <span className="whitespace-nowrap">{children}</span>
      </span>
    </button>
  )
})
