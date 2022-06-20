import { Popover as HPopover, Transition } from '@headlessui/react'
import clsx from 'clsx'
import { FC, ReactElement, ReactNode } from 'react'

interface Props {
  trigger: ReactNode
  children: ReactElement
  panelClassName?: string
  triggerClassName?: string
  position?: 'right' | 'left'
}

const Popover: FC<Props> = ({
  trigger,
  children,
  panelClassName,
  triggerClassName,
  position = 'right'
}) => (
  <HPopover className="relative">
    <HPopover.Button
      as="div"
      className={clsx('cursor-pointer', triggerClassName)}
    >
      {trigger}
    </HPopover.Button>
    <Transition
      enter="transition duration-200 ease-out"
      enterFrom="transform scale-95 opacity-0"
      enterTo="transform scale-100 opacity-100"
      leave="transition duration-75 ease-out"
      leaveFrom="transform scale-100 opacity-100"
      leaveTo="transform scale-95 opacity-0"
      className={clsx('absolute z-10', {
        'right-0': position === 'right',
        'left-0': position === 'left'
      })}
    >
      <HPopover.Panel className={clsx(panelClassName)}>
        {children}
      </HPopover.Panel>
    </Transition>
  </HPopover>
)

export default Popover
