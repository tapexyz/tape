import { Dialog, Transition } from '@headlessui/react'
import clsx from 'clsx'
import type { FC } from 'react'
import React, { Fragment } from 'react'
import { MdOutlineClose } from 'react-icons/md'

type Props = {
  show: boolean
  title?: React.ReactNode
  onClose?: () => void
  children: React.ReactNode
  panelClassName?: string
}

const Modal: FC<Props> = ({
  show,
  onClose,
  children,
  title,
  panelClassName
}) => {
  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog as="div" className="relative z-20" onClose={() => onClose?.()}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 dark:bg-opacity-80" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex h-full min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={clsx(
                  'bg-secondary w-full transform overflow-x-hidden rounded-2xl p-5 py-5 text-left align-middle shadow-xl transition-all',
                  panelClassName
                )}
              >
                {title && (
                  <div className="flex items-center justify-between pb-2">
                    <Dialog.Title
                      as="h3"
                      className="text-sm font-medium uppercase leading-6 tracking-wider opacity-70"
                    >
                      {title}
                    </Dialog.Title>
                    {onClose && (
                      <button
                        type="button"
                        className="rounded-md bg-gray-100 p-1 focus:outline-none dark:bg-gray-900"
                        onClick={() => onClose?.()}
                      >
                        <MdOutlineClose />
                      </button>
                    )}
                  </div>
                )}
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default Modal
