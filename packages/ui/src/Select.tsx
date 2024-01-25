import * as SelectPrimitive from '@radix-ui/react-select'
import { tw } from '@tape.xyz/browser'
import type { ElementRef, ReactNode } from 'react'
import React, { forwardRef } from 'react'

import { CheckOutline, ChevronDownOutline, ChevronUpOutline } from './icons'

type SelectItemProps = SelectPrimitive.SelectItemProps & {
  children?: ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export const SelectItem = forwardRef<
  ElementRef<typeof SelectPrimitive.Item>,
  SelectItemProps
>(({ children, className, size = 'md', ...props }, ref) => {
  const sizeClasses = {
    'px-3 py-1.5 text-xs': size === 'sm',
    'px-4 py-2 text-sm': size === 'md',
    'px-6 py-3 text-sm': size === 'lg'
  }

  return (
    <SelectPrimitive.Item
      className={tw(
        sizeClasses,
        'relative flex select-none items-center justify-between space-x-2 rounded-md leading-none hover:bg-gray-100 data-[disabled]:pointer-events-none data-[highlighted]:bg-gray-200 data-[state=checked]:font-semibold data-[highlighted]:outline-none dark:hover:bg-gray-800 dark:data-[highlighted]:bg-gray-800',
        className
      )}
      ref={ref}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator>
        <CheckOutline className={tw(size === 'sm' ? 'size-2' : 'size-3')} />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  )
})
SelectItem.displayName = 'SelectItem'

type SelectProps = SelectPrimitive.SelectProps & {
  children?: ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export const Select = forwardRef<
  ElementRef<typeof SelectPrimitive.Root>,
  SelectProps
>(({ children, className, size = 'md', ...props }, ref) => {
  const sizeClasses = {
    'px-3 py-1 text-xs': size === 'sm',
    'px-4 py-1.5 text-sm': size === 'md',
    'px-6 py-3 text-sm': size === 'lg'
  }

  return (
    <SelectPrimitive.Root {...props}>
      <SelectPrimitive.Trigger
        className={tw(
          sizeClasses,
          'flex w-full appearance-none items-center justify-between space-x-2 rounded-lg border border-gray-200 focus:outline-none dark:border-gray-800',
          className
        )}
        aria-label="Food"
        ref={ref}
      >
        <SelectPrimitive.Value />
        <SelectPrimitive.Icon>
          <ChevronDownOutline className="size-3" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content className="z-10 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-black">
          <SelectPrimitive.ScrollUpButton className="flex justify-center py-2">
            <ChevronUpOutline className="size-3" />
          </SelectPrimitive.ScrollUpButton>
          <SelectPrimitive.Viewport
            className={tw(size === 'sm' ? 'p-2' : 'p-3')}
          >
            {children}
          </SelectPrimitive.Viewport>
          <SelectPrimitive.ScrollDownButton className="flex justify-center py-2">
            <ChevronDownOutline className="size-3" />
          </SelectPrimitive.ScrollDownButton>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  )
})

Select.displayName = 'Select'
