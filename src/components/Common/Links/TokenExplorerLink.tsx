import { POLYGONSCAN_URL } from '@utils/constants'
import Link from 'next/link'
import React, { ReactElement } from 'react'

const TokenExplorerLink = ({
  address,
  children
}: {
  address: string
  children: ReactElement
}) => {
  return (
    <Link
      href={`${POLYGONSCAN_URL}/token/${address}`}
      rel="noreferer noreferrer"
      target="_blank"
    >
      {children}
    </Link>
  )
}

export default TokenExplorerLink
