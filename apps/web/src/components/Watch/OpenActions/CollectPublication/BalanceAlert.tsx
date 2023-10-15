import WarningOutline from '@components/Common/Icons/WarningOutline'
import { Trans } from '@lingui/macro'
import { Callout } from '@radix-ui/themes'
import { IS_MAINNET } from '@tape.xyz/constants'
import type {
  MultirecipientFeeCollectOpenActionSettings,
  SimpleCollectOpenActionSettings
} from '@tape.xyz/lens'
import Link from 'next/link'
import type { FC } from 'react'
import React from 'react'

const getUniswapURL = (amount: number, outputCurrency: string): string => {
  return `https://app.uniswap.org/#/swap?exactField=output&exactAmount=${amount}&outputCurrency=${outputCurrency}&chain=${
    IS_MAINNET ? 'polygon' : 'polygon_mumbai'
  }`
}

type Props = {
  action:
    | SimpleCollectOpenActionSettings
    | MultirecipientFeeCollectOpenActionSettings
}

const BalanceAlert: FC<Props> = ({ action }) => {
  return (
    <div className="flex-1">
      <Callout.Root color="red">
        <Callout.Icon>
          <WarningOutline className="h-4 w-4" />
        </Callout.Icon>
        <Callout.Text>
          <div className="flex w-full flex-1 items-center justify-between space-x-2 text-sm">
            <span>
              <Trans>Not enough</Trans> {action?.amount?.asset?.symbol}{' '}
              <Trans>token balance</Trans>
            </span>
            <Link
              href={getUniswapURL(
                parseFloat(action?.amount?.value),
                action?.amount?.asset?.contract.address
              )}
              rel="noreferer noreferrer"
              target="_blank"
              className="text-brand-500"
            >
              <Trans>Swap</Trans>
            </Link>
          </div>
        </Callout.Text>
      </Callout.Root>
    </div>
  )
}

export default BalanceAlert
