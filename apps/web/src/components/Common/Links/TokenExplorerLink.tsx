import Link from 'next/link'
import type { ReactElement } from 'react'
import React from 'react'
import { RARIBLE_MARKETPLACE_URL } from 'utils'

const TokenExplorerLink = ({
  address,
  children
}: {
  address: string
  children: ReactElement
}) => {
  return (
    <Link
      href={`${RARIBLE_MARKETPLACE_URL}/collection/polygon/${address}`}
      rel="noreferer noreferrer"
      target="_blank"
    >
      {children}
    </Link>
  )
}

export default TokenExplorerLink
