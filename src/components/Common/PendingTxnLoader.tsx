import { Loader } from '@components/UIElements/Loader'
import usePendingTxn from '@utils/hooks/usePendingTxn'
import React, { FC, useEffect } from 'react'

type Props = {
  txnHash: string
  isPublication?: boolean
  // eslint-disable-next-line no-unused-vars
  onIndexed: (data: any) => void
}

const PendingTxnLoader: FC<Props> = ({
  txnHash,
  onIndexed,
  isPublication = false
}) => {
  const { indexed, data } = usePendingTxn(txnHash || '', isPublication)

  useEffect(() => {
    if (indexed) onIndexed(data)
  }, [indexed, onIndexed, data])

  if (indexed) return null

  return (
    <div className="inline-flex items-center space-x-1.5 font-medium">
      <Loader size="sm" />
      <span className="text-sm">Indexing</span>
    </div>
  )
}

export default PendingTxnLoader
