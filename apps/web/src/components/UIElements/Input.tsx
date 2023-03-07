import InfoOutline from '@components/Common/Icons/InfoOutline'
import clsx from 'clsx'
import type { InputHTMLAttributes } from 'react'
import React, { forwardRef, useId } from 'react'

import Tooltip from './Tooltip'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  info?: string
  type?: string
  className?: string
  validationError?: string
  prefix?: string
  suffix?: string
  showErrorLabel?: boolean
}
export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  {
    label,
    info,
    type = 'text',
    validationError,
    className = '',
    showErrorLabel = true,
    prefix,
    suffix,
    ...props
  },
  ref
) {
  const id = useId()
  return (
    <label className="w-full" htmlFor={id}>
      {label && (
        <div className="flex">
          <div className="mb-1 flex items-center space-x-1.5">
            <div className="text-[11px] font-semibold uppercase tracking-wider opacity-70">
              {label}
            </div>
          </div>
          {info && (
            <Tooltip content={info} placement="top">
              <span>
                <InfoOutline className="my-0.5 mx-1 h-3 w-3 opacity-70" />
              </span>
            </Tooltip>
          )}
        </div>
      )}
      <div className="flex">
        {prefix && (
          <span className="inline-flex items-center rounded-l-xl border border-r-0 border-gray-300 bg-gray-100 px-4 text-sm dark:border-gray-700 dark:bg-gray-900">
            {prefix}
          </span>
        )}
        <input
          id={id}
          className={clsx(
            {
              'focus:ring-1 focus:ring-indigo-500': !validationError?.length,
              '!border-red-500': validationError?.length,
              'rounded-r-xl': prefix,
              'rounded-xl': !prefix && !suffix,
              'rounded-l-xl': suffix
            },
            'w-full border border-gray-300 bg-white px-2.5 py-2 text-sm outline-none disabled:bg-gray-500 disabled:bg-opacity-20 disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900',
            className
          )}
          ref={ref}
          type={type}
          {...props}
        />
        {suffix && (
          <span className="inline-flex items-center whitespace-nowrap rounded-r-xl border border-l-0 border-gray-300 bg-gray-100 px-4 text-sm dark:border-gray-700 dark:bg-gray-900">
            {suffix}
          </span>
        )}
      </div>
      {validationError && showErrorLabel ? (
        <div className="mx-1 mt-1 text-xs font-medium text-red-500">
          {validationError}
        </div>
      ) : null}
    </label>
  )
})
