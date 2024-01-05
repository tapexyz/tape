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
  ({ children, className, ...props }, ref) => (
    <button
      ref={ref}
      className={clsx(
        'scale-100 appearance-none rounded-lg border border-gray-200 px-6 py-3 text-sm font-semibold transition-colors hover:bg-gray-200 active:scale-[0.98] disabled:hover:bg-inherit disabled:active:scale-100 dark:border-gray-800 dark:hover:bg-gray-800',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
)

Button.displayName = 'Button'
