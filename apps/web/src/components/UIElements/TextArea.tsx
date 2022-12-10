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
          <div className="flex items-center mb-1 space-x-1.5">
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
              'bg-white text-sm px-2.5 py-2 rounded-xl dark:bg-gray-900 border border-gray-300 dark:border-gray-700 outline-none disabled:opacity-60 disabled:bg-gray-500 disabled:bg-opacity-20 w-full',
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
