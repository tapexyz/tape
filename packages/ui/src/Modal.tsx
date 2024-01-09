import * as Dialog from '@radix-ui/react-dialog'
import clsx from 'clsx'
import type { FC, ReactNode } from 'react'
import React from 'react'

import { TimesOutline } from './icons'

type Props = {
  title: ReactNode | string
  description?: ReactNode | string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg'
  show: boolean
  setShow: (show: boolean) => void
}

export const Modal: FC<Props> = ({
  children,
  title,
  description,
  show,
  setShow,
  size = 'md'
}) => {
  const sizeClasses = {
    'max-w-[450px]': size === 'sm',
    'max-w-[550px]': size === 'md',
    'max-w-[650px]': size === 'lg'
  }
  return (
    <Dialog.Root open={show} onOpenChange={setShow}>
      <Dialog.Trigger />
      <Dialog.Portal>
        <Dialog.Overlay className="data-[state=open]:animate-overlayShow fixed inset-0 bg-gray-500 bg-opacity-10 backdrop-blur" />
        <Dialog.Content
          className={clsx(
            sizeClasses,
            'data-[state=open]:animate-contentShow fixed left-[50%] top-[50%] max-h-[85vh] w-[90vw] translate-x-[-50%] translate-y-[-50%] space-y-4 rounded-xl bg-white p-5 focus:outline-none dark:bg-black'
          )}
        >
          <div className="flex items-center justify-between">
            <Dialog.Title className="text-lg font-semibold">
              {title}
            </Dialog.Title>
            <button className="flex" onClick={() => setShow(false)}>
              <span className="cursor-pointer rounded p-1.5 hover:bg-gray-100 dark:hover:bg-gray-900">
                <TimesOutline outlined={false} className="size-3" />
              </span>
            </button>
          </div>
          {description && (
            <Dialog.Description className="leading-normal">
              {description}
            </Dialog.Description>
          )}
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
