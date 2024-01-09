import * as PrimitiveDropdownMenu from '@radix-ui/react-dropdown-menu'
import clsx from 'clsx'
import type { ElementRef, FC, ReactNode } from 'react'
import React, { forwardRef } from 'react'

export const DropdownMenuSub = PrimitiveDropdownMenu.Sub
export const DropdownMenuSeparator = PrimitiveDropdownMenu.Separator
export const DropdownMenuContent = PrimitiveDropdownMenu.Content
export const DropdownMenuPortal = PrimitiveDropdownMenu.Portal

type DropdownMenuSubContentProps = PrimitiveDropdownMenu.MenuSubContentProps & {
  children?: ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg'
}
export const DropdownMenuSubContent = forwardRef<
  ElementRef<typeof PrimitiveDropdownMenu.SubContent>,
  DropdownMenuSubContentProps
>(({ children, className, size = 'sm', ...props }, ref) => {
  const sizeClasses = {
    'p-2 text-sm': size === 'sm',
    'p-3 text-sm': size === 'md',
    'px-8 py-4 text-base': size === 'lg'
  }
  return (
    <PrimitiveDropdownMenu.SubContent
      sideOffset={5}
      className={clsx(
        sizeClasses,
        'tape-border rounded-md bg-white leading-none data-[disabled]:pointer-events-none data-[highlighted]:bg-gray-200 data-[highlighted]:outline-none dark:bg-black dark:data-[highlighted]:bg-gray-800',
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </PrimitiveDropdownMenu.SubContent>
  )
})
DropdownMenuSubContent.displayName = 'DropdownMenuSubContent'

type DropdownMenuSubTriggerProps = PrimitiveDropdownMenu.MenuSubTriggerProps & {
  children?: ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg'
}
export const DropdownMenuSubTrigger = forwardRef<
  ElementRef<typeof PrimitiveDropdownMenu.SubTrigger>,
  DropdownMenuSubTriggerProps
>(({ children, className, size = 'sm', ...props }, ref) => {
  const sizeClasses = {
    'px-4 py-2 text-sm': size === 'sm',
    'px-6 py-3 text-sm': size === 'md',
    'px-8 py-4 text-base': size === 'lg'
  }
  return (
    <PrimitiveDropdownMenu.SubTrigger
      className={clsx(
        sizeClasses,
        'relative select-none items-center rounded-md leading-none data-[disabled]:pointer-events-none data-[highlighted]:bg-gray-200 data-[highlighted]:outline-none dark:data-[highlighted]:bg-gray-800',
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </PrimitiveDropdownMenu.SubTrigger>
  )
})
DropdownMenuSubTrigger.displayName = 'DropdownMenuSubTrigger'

type DropdownMenuItemProps = PrimitiveDropdownMenu.DropdownMenuItemProps & {
  children?: ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg'
}
export const DropdownMenuItem = forwardRef<
  ElementRef<typeof PrimitiveDropdownMenu.Item>,
  DropdownMenuItemProps
>(({ children, className, size = 'sm', ...props }, ref) => {
  const sizeClasses = {
    'px-4 py-2 text-sm': size === 'sm',
    'px-6 py-3 text-sm': size === 'md',
    'px-8 py-4 text-base': size === 'lg'
  }

  return (
    <PrimitiveDropdownMenu.Item
      className={clsx(
        sizeClasses,
        'relative select-none items-center space-x-2 rounded-md leading-none data-[disabled]:pointer-events-none data-[highlighted]:bg-gray-200 data-[highlighted]:outline-none dark:hover:bg-gray-800 dark:data-[highlighted]:bg-gray-800',
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </PrimitiveDropdownMenu.Item>
  )
})
DropdownMenuItem.displayName = 'DropdownMenuItem'

type DropdownMenuProps = {
  trigger: React.ReactNode
  children: React.ReactNode
}

export const DropdownMenu: FC<DropdownMenuProps> = ({ trigger, children }) => {
  return (
    <PrimitiveDropdownMenu.Root>
      <PrimitiveDropdownMenu.Trigger>{trigger}</PrimitiveDropdownMenu.Trigger>
      <DropdownMenuPortal>{children}</DropdownMenuPortal>
    </PrimitiveDropdownMenu.Root>
  )
}
