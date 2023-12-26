import type { Placement } from 'tippy.js'

import Tippy from '@tippyjs/react'
import clsx from 'clsx'
import { useTheme } from 'next-themes'
import React from 'react'
import 'tippy.js/themes/light.css'
import 'tippy.js/themes/translucent.css'

type Props = {
  children: React.ReactElement
  content: React.ReactNode
  placement?: Placement
  visible?: boolean
}

const Tooltip = ({
  children,
  content,
  placement = 'bottom',
  visible = true,
  ...props
}: Props) => {
  const { resolvedTheme } = useTheme()
  return (
    <Tippy
      {...props}
      arrow={false}
      className={clsx('hidden !rounded-lg !font-normal', {
        'sm:block': visible
      })}
      content={content}
      placement={placement}
      theme={resolvedTheme === 'dark' ? 'translucent' : 'light'}
    >
      {children}
    </Tippy>
  )
}

export default Tooltip
