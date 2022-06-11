import { Popover as HPopover, Transition } from '@headlessui/react'
import clsx from 'clsx'
import { FC, ReactElement, ReactNode } from 'react'

interface Props {
  trigger: ReactNode
  children: ReactElement
  panelClassName?: string
}

const Popover: FC<Props> = ({ trigger, children, panelClassName }) => (
  <HPopover className="relative">
    <HPopover.Button as="div" className="cursor-pointer">
      {trigger}
    </HPopover.Button>
    <Transition
      enter="transition duration-200 ease-out"
      enterFrom="transform scale-95 opacity-0"
      enterTo="transform scale-100 opacity-100"
      leave="transition duration-75 ease-out"
      leaveFrom="transform scale-100 opacity-100"
      leaveTo="transform scale-95 opacity-0"
      className={'absolute z-10 right-0'}
    >
      <HPopover.Panel className={clsx(panelClassName)}>
        {children}
      </HPopover.Panel>
    </Transition>
  </HPopover>
)

export default Popover
