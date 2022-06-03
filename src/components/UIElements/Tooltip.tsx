import 'tippy.js/dist/tippy.css'

import Tippy from '@tippyjs/react'
import clsx from 'clsx'
import React from 'react'
import type { Placement } from 'tippy.js'

type Props = {
  children: React.ReactElement
  content: React.ReactNode
  placement?: Placement
  className?: string
}

const Tooltip = ({
  children,
  content,
  placement = 'bottom',
  className,
  ...props
}: Props) => {
  return (
    <Tippy
      {...props}
      placement={placement}
      content={content}
      arrow={false}
      className={clsx(
        className,
        '!shadow md:block hidden !rounded-md !text-black dark:!text-white !px-1 dark:!bg-gray-900 !bg-white'
      )}
    >
      {children}
    </Tippy>
  )
}

export default Tooltip
