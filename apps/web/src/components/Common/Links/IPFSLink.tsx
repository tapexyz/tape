import type { ReactElement } from 'react'

import { IPFS_GATEWAY_URL } from '@tape.xyz/constants'
import Link from 'next/link'
import React from 'react'

const IPFSLink = ({
  children,
  hash
}: {
  children: ReactElement
  hash: string
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
