import 'tippy.js/dist/tippy.css'
import 'tippy.js/themes/light.css'
import 'tippy.js/themes/material.css'

import Tippy from '@tippyjs/react'
import { useTheme } from 'next-themes'
import React from 'react'
import type { Placement } from 'tippy.js'

type Props = {
  children: React.ReactElement
  content: React.ReactNode
  placement?: Placement
}

const Tooltip = ({
  children,
  content,
  placement = 'bottom',
  ...props
}: Props) => {
  const { resolvedTheme } = useTheme()
  return (
    <Tippy
      {...props}
      placement={placement}
      content={content}
      theme={resolvedTheme === 'dark' ? 'material' : 'light'}
      className="hidden sm:block !font-normal !text-xs tracking-wide !rounded-md !px-0.5"
    >
      {children}
    </Tippy>
  )
}

export default Tooltip
