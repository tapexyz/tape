import WarningOutline from '@components/Common/Icons/WarningOutline'
import { IS_MAINNET } from '@dragverse/constants'
import type { SupportedOpenActionModuleType } from '@dragverse/lens/custom-types'
import { Callout } from '@radix-ui/themes'
import Link from 'next/link'
import type { FC } from 'react'

const getUniswapURL = (amount: number, outputCurrency: string): string => {
  return `https://app.uniswap.org/#/swap?exactField=output&exactAmount=${amount}&outputCurrency=${outputCurrency}&chain=${
    IS_MAINNET ? 'polygon' : 'polygon_mumbai'
  }`
}

type Props = {
  action: SupportedOpenActionModuleType
}

const BalanceAlert: FC<Props> = ({ action }) => {
  return (
    <div className="flex-1">
      <Callout.Root color="red">
        <Callout.Icon>
          <WarningOutline className="h-4 w-4" />
        </Callout.Icon>
        <Callout.Text highContrast>
          <div className="flex w-full flex-1 items-center justify-between space-x-2 text-sm">
            <span>
              Not enough {action?.amount?.asset?.symbol} token balance
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
              Swap
            </Link>
          </div>
        </Callout.Text>
      </Callout.Root>
    </div>
  )
}

export default BalanceAlert
