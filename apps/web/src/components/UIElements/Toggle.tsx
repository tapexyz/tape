import { Switch } from '@headlessui/react'
import clsx from 'clsx'
import type { Dispatch, FC } from 'react'
import React from 'react'

interface ToggleProps {
  enabled: boolean
  setEnabled: Dispatch<boolean>
  label?: string
  size?: 'sm' | 'md'
  disabled?: boolean
}

export const Toggle: FC<ToggleProps> = ({
  enabled,
  setEnabled,
  label,
  size = 'md',
  disabled = false
}) => {
  return (
    <div className="inline-flex items-center space-x-2">
      <Switch
        disabled={disabled}
        checked={enabled}
        onChange={() => setEnabled(!enabled)}
        className={clsx(
          enabled ? 'bg-indigo-500' : 'bg-gray-200 dark:bg-gray-700',
          'inline-flex h-4 w-8 flex-none items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
          {
            'h-4 w-8': size === 'sm',
            'h-[22px] w-[38px]': size === 'md',
            'cursor-pointer': !disabled
          }
        )}
      >
        <span
          aria-hidden="true"
          className={clsx(
            enabled ? 'translate-x-4' : 'translate-x-0',
            'pointer-events-none inline-block transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out',
            {
              'h-3 w-3': size === 'sm',
              'h-4 w-4': size === 'md'
            }
          )}
        />
      </Switch>
      <span className="text-sm">{label}</span>
    </div>
  )
}
