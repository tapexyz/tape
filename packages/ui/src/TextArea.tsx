import clsx from 'clsx'
import type { ComponentProps } from 'react'
import { forwardRef, useId } from 'react'

interface TextAreaProps extends Omit<ComponentProps<'textarea'>, 'prefix'> {
  label?: string
  info?: string
  error?: string
  showError?: boolean
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, label, error, ...props }, ref) => {
    const id = useId()

    return (
      <label className="w-full" htmlFor={id}>
        {label ? (
          <div className="mb-1 flex items-center space-x-1.5 text-sm font-medium text-gray-800 dark:text-gray-200">
            {label}
          </div>
        ) : null}
        <div className="flex w-full items-center rounded-lg text-sm">
          <textarea
            className={clsx(
              { 'placeholder:text-red-500': error },
              'w-full rounded-lg border-none bg-gray-100 px-3 py-2 focus:outline-none dark:bg-gray-900',
              className
            )}
            id={id}
            ref={ref}
            {...props}
          />
        </div>
        {error ? <p className="text-sm text-red-500">{error}</p> : null}
      </label>
    )
  }
)

TextArea.displayName = 'TextArea'
