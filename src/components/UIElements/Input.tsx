import clsx from 'clsx'
import { FC, InputHTMLAttributes } from 'react'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  id?: string
  type?: string
  className?: string
  validationError?: string
}

export const Input: FC<Props> = ({
  label,
  type = 'text',
  validationError,
  className = '',
  id,
  ...props
}) => {
  return (
    <label className="w-full" htmlFor={id}>
      {label && (
        <div className="flex items-center mb-1 space-x-1.5">
          <div
            className={clsx('text-[11px] font-semibold uppercase opacity-70', {
              required: props.required
            })}
          >
            {label}
          </div>
        </div>
      )}
      <div className="flex">
        <input
          id={id}
          className={clsx(
            { '!border-red-500': validationError?.length },
            'bg-white text-sm px-2.5 py-2 rounded-xl dark:bg-gray-900 border border-gray-200 dark:border-gray-800 outline-none disabled:opacity-60 disabled:bg-gray-500 disabled:bg-opacity-20 focus:ring-1 focus:ring-indigo-500 w-full',
            className
          )}
          type={type}
          {...props}
        />
      </div>
      {validationError && (
        <div className="mx-1 mt-1 text-sm text-red-500">{validationError}</div>
      )}
    </label>
  )
}
