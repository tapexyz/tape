import * as PrimitiveSwitch from '@radix-ui/react-switch'
import { tw } from '@tape.xyz/browser'
import type { ElementRef } from 'react'
import React, { forwardRef, useId } from 'react'

type Props = PrimitiveSwitch.SwitchProps & {
  className?: string
  label?: string
  size?: 'sm' | 'md' | 'lg'
}

export const Switch = forwardRef<
  ElementRef<typeof PrimitiveSwitch.Root>,
  Props
>(({ className, label, size = 'md', ...props }, ref) => {
  const id = useId()

  const sizeClasses = {
    'h-4 w-7': size === 'sm',
    'h-5 w-9': size === 'md',
    'h-6 w-12': size === 'lg'
  }

  const thumbSizeClasses = {
    'size-3 data-[state=checked]:translate-x-[14px]': size === 'sm',
    'size-4 data-[state=checked]:translate-x-[18px]': size === 'md',
    'size-5 data-[state=checked]:translate-x-[26px]': size === 'lg'
  }

  const labelSizeClasses = {
    'text-xs': size === 'sm',
    'text-lg': size === 'lg'
  }

  return (
    <div className="flex items-center space-x-1.5">
      <PrimitiveSwitch.Root
        className={tw(
          sizeClasses,
          'relative cursor-default rounded-full bg-gray-200 outline-none data-[state=checked]:bg-black dark:bg-gray-800',
          className
        )}
        id={id}
        ref={ref}
        {...props}
      >
        <PrimitiveSwitch.Thumb
          className={tw(
            thumbSizeClasses,
            'block translate-x-0.5 rounded-full bg-white transition-transform duration-100 will-change-transform'
          )}
        />
      </PrimitiveSwitch.Root>
      <label className={tw(labelSizeClasses, 'leading-none')} htmlFor={id}>
        {label}
      </label>
    </div>
  )
})

Switch.displayName = 'Switch'
