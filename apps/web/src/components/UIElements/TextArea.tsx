import clsx from 'clsx'
import type { ComponentProps } from 'react'
import React, { forwardRef, useId } from 'react'

interface Props extends ComponentProps<'textarea'> {
  label?: string
  type?: string
  className?: string
  validationError?: string
}

export const TextArea = forwardRef<HTMLTextAreaElement, Props>(
  function TextArea({ label, validationError, className = '', ...props }, ref) {
    const id = useId()
    return (
      <label className="w-full" htmlFor={id}>
        {label && (
          <div className="mb-1 flex items-center space-x-1.5">
            <div className="text-[11px] font-semibold uppercase opacity-70">
              {label}
            </div>
          </div>
        )}
        <div className="flex">
          <textarea
            id={id}
            className={clsx(
              validationError?.length
                ? '!border-red-500'
                : 'focus:ring-1 focus:ring-indigo-500',
              'w-full rounded-xl border border-gray-300 bg-white px-2.5 py-2 text-sm outline-none disabled:bg-gray-500 disabled:bg-opacity-20 disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900',
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {validationError && (
          <div className="mx-1 mt-1 text-xs font-medium text-red-500">
            {validationError}
          </div>
        )}
      </label>
    )
  }
)
