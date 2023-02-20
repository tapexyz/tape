import Link from 'next/link'
import type { ReactElement } from 'react'
import React from 'react'
import { IPFS_GATEWAY } from 'utils'

const IPFSLink = ({
  hash,
  children
}: {
  hash: string
  children: ReactElement
}) => {
  return (
    <Link
      href={`${IPFS_GATEWAY}/${hash}`}
      rel="noreferer noreferrer"
      target="_blank"
    >
      {children}
    </Link>
  )
}

export default IPFSLink
