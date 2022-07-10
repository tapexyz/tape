import { POLYGONSCAN_URL } from '@utils/constants'
import Link from 'next/link'
import React, { ReactElement } from 'react'

export const AddressExplorerLink = ({
  address,
  children
}: {
  address: string
  children: ReactElement
}) => {
  return (
    <Link href={`${POLYGONSCAN_URL}/address/${address}`}>
      <a rel="noreferer noreferrer" target="_blank">
        {children}
      </a>
    </Link>
  )
}

export const HashExplorerLink = ({
  hash,
  children
}: {
  hash: string
  children: ReactElement
}) => {
  return (
    <Link href={`${POLYGONSCAN_URL}/hash/${hash}`}>
      <a rel="noreferer noreferrer" target="_blank">
        {children}
      </a>
    </Link>
  )
}
