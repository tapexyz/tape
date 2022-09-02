import { POLYGONSCAN_URL } from '@utils/constants'
import Link from 'next/link'
import React, { ReactElement } from 'react'

const AddressExplorerLink = ({
  address,
  children
}: {
  address: string
  children: ReactElement
}) => {
  return (
    <Link
      href={`${POLYGONSCAN_URL}/address/${address}`}
      rel="noreferer noreferrer"
      target="_blank"
    >
      {children}
    </Link>
  )
}

export default AddressExplorerLink
