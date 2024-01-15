import { IS_MAINNET } from '@tape.xyz/constants'
import { Callout, WarningOutline } from '@tape.xyz/ui'
import Link from 'next/link'
import type { FC } from 'react'
import React from 'react'

const getUniswapURL = (amount: number, outputCurrency: string): string => {
  return `https://app.uniswap.org/#/swap?exactField=output&exactAmount=${amount}&outputCurrency=${outputCurrency}&chain=${
    IS_MAINNET ? 'polygon' : 'polygon_mumbai'
  }`
}

type Props = {
  currencyName: string
  value: string
  address: string
}

const BalanceAlert: FC<Props> = ({ currencyName, value, address }) => {
  return (
    <div className="flex-1">
      <Callout variant="danger" icon={<WarningOutline className="size-4" />}>
        <div className="flex w-full flex-1 items-center justify-between space-x-2 text-sm">
          <span>Not enough {currencyName} token balance</span>
          <Link
            href={getUniswapURL(parseFloat(value), address)}
            rel="noreferer noreferrer"
            target="_blank"
            className="text-brand-500"
          >
            Swap
          </Link>
        </div>
      </Callout>
    </div>
  )
}

export default BalanceAlert
