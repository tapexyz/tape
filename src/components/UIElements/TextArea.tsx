import clsx from 'clsx'
import { ComponentProps, forwardRef } from 'react'

interface Props extends ComponentProps<'textarea'> {
  label?: string
  id?: string
  type?: string
  className?: string
  validationError?: string
}

export const TextArea = forwardRef<HTMLTextAreaElement, Props>(
  function TextArea(
    { label, validationError, className = '', id, ...props },
    ref
  ) {
    return (
      <label className="w-full" htmlFor={id}>
        {label && (
          <div className="flex items-center mb-1 space-x-1.5">
            <div
              className={clsx('text-[11px] font-semibold uppercase opacity-70')}
            >
              {label}
            </div>
          </div>
        )}
        <div className="flex">
          <textarea
            id={id}
            className={clsx(
              {
                'focus:ring-1 focus:ring-indigo-500': !validationError?.length,
                '!border-red-500': validationError?.length
              },
              'bg-white text-sm px-2.5 py-2 rounded-xl dark:bg-gray-900 border border-gray-200 dark:border-gray-800 outline-none disabled:opacity-60 disabled:bg-gray-500 disabled:bg-opacity-20 w-full',
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
