import Tippy from '@tippyjs/react'
import clsx from 'clsx'
import React from 'react'
import type { Placement } from 'tippy.js'

type Props = {
  children: React.ReactElement
  content: React.ReactNode
  placement?: Placement
  visible?: boolean
}

const Tooltip = ({
  children,
  content,
  visible = true,
  placement = 'bottom',
  ...props
}: Props) => {
  return (
    <Tippy
      {...props}
      placement={placement}
      content={content}
      className={clsx('hidden !text-xs tracking-wide !rounded-lg', {
        'sm:block': visible
      })}
    >
      {children}
    </Tippy>
  )
}

export default Tooltip
