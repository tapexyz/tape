import clsx from 'clsx'
import type { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from 'react'
import { forwardRef } from 'react'

interface ButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  icon?: ReactNode
  outline?: boolean
  className?: string
  children?: ReactNode
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'secondary' | 'danger'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { children, className, size = 'md', variant = 'primary', ...props },
    ref
  ) => {
    const sizeClasses = {
      'px-4 py-2 text-sm': size === 'sm',
      'px-6 py-3 text-sm': size === 'md',
      'px-8 py-4 text-base': size === 'lg'
    }
    const variantClasses = {
      'hover:bg-gray-700 border border-transparent bg-gray-800 text-gray-100 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-gray-200':
        variant === 'primary',
      'border border-gray-200 dark:border-gray-800 dark:hover:bg-gray-800 hover:bg-gray-100':
        variant === 'secondary',
      '': variant === 'danger'
    }

    return (
      <button
        ref={ref}
        className={clsx(
          sizeClasses,
          variantClasses,
          'scale-100 appearance-none rounded-lg font-semibold transition-colors duration-150 active:scale-[0.98] disabled:pointer-events-none',
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
