import 'tippy.js/themes/light.css'
import 'tippy.js/themes/material.css'

import Tippy from '@tippyjs/react'
import clsx from 'clsx'
import { useTheme } from 'next-themes'
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
  const { resolvedTheme } = useTheme()
  return (
    <Tippy
      {...props}
      placement={placement}
      content={content}
      arrow={false}
      theme={resolvedTheme === 'dark' ? 'material' : 'light'}
      className={clsx('hidden !rounded-lg !font-normal', {
        'sm:block': visible
      })}
    >
      {children}
    </Tippy>
  )
}

export default Tooltip
