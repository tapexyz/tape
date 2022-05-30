import { Popover as HPopover } from '@headlessui/react'
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
    <HPopover.Panel className={clsx(panelClassName, 'absolute z-10')}>
      {children}
    </HPopover.Panel>
  </HPopover>
)

export default Popover
