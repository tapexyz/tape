import { IEXEC_BLOCKSCOUT_URL } from '@tape.xyz/constants'
import Link from 'next/link'
import type { ReactElement } from 'react'
import React from 'react'

const IExecExplorerLink = ({
  address,
  children
}: {
  address: string
  children: ReactElement
}) => {
  return (
    <Link
      href={`${IEXEC_BLOCKSCOUT_URL}/address/${address}`}
      rel="noreferer noreferrer"
      target="_blank"
    >
      {children}
    </Link>
  )
}

export default IExecExplorerLink
