import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { tw } from '@tape.xyz/browser'
import type { ElementRef } from 'react'
import React, { forwardRef, useId } from 'react'

import { CheckOutline } from './icons'

type Props = CheckboxPrimitive.CheckboxProps & {
  className?: string
  label?: string
  size?: 'sm' | 'md' | 'lg'
}

export const Checkbox = forwardRef<
  ElementRef<typeof CheckboxPrimitive.Root>,
  Props
>(({ size = 'md', className, label, ...props }, ref) => {
  const id = useId()

  const sizeClasses = {
    'size-3': size === 'sm',
    'size-4': size === 'md',
    'size-5': size === 'lg'
  }

  return (
    <form>
      <div className="flex items-center space-x-1.5">
        <CheckboxPrimitive.Root
          className={tw(
            className,
            'tape-border flex appearance-none items-center justify-center rounded outline-none',
            sizeClasses
          )}
          defaultChecked
          ref={ref}
          id={id}
          {...props}
        >
          <CheckboxPrimitive.Indicator>
            <CheckOutline className={tw(sizeClasses, 'p-[3px]')} />
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
        <label
          className={tw(
            'font-medium leading-none',
            size === 'lg' ? 'text-base' : 'text-sm'
          )}
          htmlFor={id}
        >
          {label}
        </label>
      </div>
    </form>
  )
})

Checkbox.displayName = 'Checkbox'
