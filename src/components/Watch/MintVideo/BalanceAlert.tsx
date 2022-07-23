import Alert from '@components/Common/Alert'
import { IS_MAINNET } from '@utils/constants'
import Link from 'next/link'
import React from 'react'
import { LenstubeCollectModule } from 'src/types/local'

const getUniswapURL = (amount: number, outputCurrency: string): string => {
  return `https://app.uniswap.org/#/swap?exactField=output&exactAmount=${amount}&outputCurrency=${outputCurrency}&chain=${
    IS_MAINNET ? 'polygon' : 'polygon_mumbai'
  }`
}

const BalanceAlert = ({
  collectModule
}: {
  collectModule: LenstubeCollectModule
}) => {
  return (
    <div className="flex-1">
      <Alert variant="warning">
        <div className="flex items-center justify-between flex-1">
          <span>
            You don't have enough {collectModule?.amount?.asset?.symbol} token
          </span>
          <Link
            href={getUniswapURL(
              parseFloat(collectModule?.amount.value),
              collectModule?.amount?.asset?.address
            )}
          >
            <a
              rel="noreferer noreferrer"
              target="_blank"
              className="text-indigo-500"
            >
              Swap
            </a>
          </Link>
        </div>
      </Alert>
    </div>
  )
}

export default BalanceAlert
