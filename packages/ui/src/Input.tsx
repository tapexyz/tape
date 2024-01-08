import clsx from 'clsx'
import type { ComponentProps } from 'react'
import { forwardRef, useId } from 'react'

interface InputProps extends Omit<ComponentProps<'input'>, 'prefix'> {
  label?: string
  info?: string
  prefix?: string
  suffix?: string
  error?: string
  showError?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, prefix, suffix, error, ...props }, ref) => {
    const id = useId()

    return (
      <label className="w-full" htmlFor={id}>
        {label ? (
          <div className="mb-1 flex items-center space-x-1.5 text-sm font-medium text-gray-800 dark:text-gray-200">
            {label}
          </div>
        ) : null}
        <div className="flex text-sm">
          {prefix ? (
            <span className="inline-flex items-center rounded-l-lg bg-gray-200/80 px-3 dark:bg-gray-800">
              {prefix}
            </span>
          ) : null}
          <div
            className={clsx(
              prefix ? 'rounded-r-lg' : 'rounded-lg',
              'flex w-full items-center'
            )}
          >
            <input
              className={clsx(
                { 'placeholder:text-red-500': error },
                prefix
                  ? 'rounded-r-lg'
                  : suffix
                    ? 'rounded-l-lg'
                    : 'rounded-lg',
                'w-full border-none bg-gray-100 px-3 py-2 focus:outline-none dark:bg-gray-900',
                className
              )}
              id={id}
              ref={ref}
              {...props}
            />
          </div>
          {suffix ? (
            <span className="inline-flex items-center rounded-r-lg bg-gray-200/80 px-3 dark:bg-gray-800">
              {suffix}
            </span>
          ) : null}
        </div>
        {error ? <p className="text-sm text-red-500">{error}</p> : null}
      </label>
    )
  }
)

Input.displayName = 'Input'
