import Link from 'next/link'
import type { ReactElement } from 'react'
import React from 'react'

const ArweaveExplorerLink = ({
  txId,
  children
}: {
  txId: string
  children: ReactElement
}) => {
  return (
    <Link
      href={`https://arweave.app/tx/${txId}`}
      rel="noreferer noreferrer"
      target="_blank"
    >
      {children}
    </Link>
  )
}

export default ArweaveExplorerLink
