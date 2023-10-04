import { IPFS_GATEWAY_URL } from '@tape.xyz/constants'
import Link from 'next/link'
import type { ReactElement } from 'react'
import React from 'react'

const IPFSLink = ({
  hash,
  children
}: {
  hash: string
  children: ReactElement
}) => {
  return (
    <Link
      href={`${IPFS_GATEWAY_URL}/${hash}`}
      rel="noreferer noreferrer"
      target="_blank"
    >
      {children}
    </Link>
  )
}

export default IPFSLink
