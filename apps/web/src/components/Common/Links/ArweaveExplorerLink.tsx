import type { ReactElement } from 'react'

import Link from 'next/link'
import React from 'react'

const ArweaveExplorerLink = ({
  children,
  txId
}: {
  children: ReactElement
  txId: string
}) => {
  return (
    <Link
      href={`https://explorer.irys.xyz/transactions/${txId}`}
      rel="noreferer noreferrer"
      target="_blank"
    >
      {children}
    </Link>
  )
}

export default ArweaveExplorerLink
