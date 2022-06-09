import { Button } from '@components/UIElements/Button'
import { Input } from '@components/UIElements/Input'
import { BUNDLR_CURRENCY, BUNDLR_WEBSITE_URL } from '@utils/constants'
import Link from 'next/link'
import React, { FC } from 'react'
import { BiChevronDown, BiChevronUp } from 'react-icons/bi'
import { MdRefresh } from 'react-icons/md'
import { BundlrDataState } from 'src/types/local'

type Props = {
  bundlrData: BundlrDataState
  setBundlrData: React.Dispatch<BundlrDataState>
  fetchBalance: () => void
  depositToBundlr: () => void
}

const BundlrInfo: FC<Props> = ({
  bundlrData,
  fetchBalance,
  setBundlrData,
  depositToBundlr
}) => {
  return (
    <div className="flex flex-col w-full p-4 my-5 space-y-4 border border-gray-200 rounded-lg dark:border-gray-800">
      <div>
        <div className="flex flex-col">
          <div className="text-[11px] inline-flex rounded justify-between items-center font-semibold uppercase opacity-70">
            <span className="inline-flex space-x-1.5">
              <span>Your Balance</span>
              <button type="button" onClick={() => fetchBalance()}>
                <MdRefresh className="text-sm" />
              </button>
            </span>
            <Link href={BUNDLR_WEBSITE_URL}>
              <a target="_blank" rel="noreferer" className="text-[9px]">
                bundlr.network ({BUNDLR_CURRENCY})
              </a>
            </Link>
          </div>
          <div className="flex justify-between">
            <span className="text-xl font-semibold">{bundlrData.balance}</span>
            <span>
              <button
                type="button"
                onClick={() =>
                  setBundlrData({
                    ...bundlrData,
                    showDeposit: !bundlrData.showDeposit
                  })
                }
                className="inline-flex items-center px-1 bg-gray-100 rounded-full focus:outline-none dark:bg-gray-800"
              >
                <span className="text-[9px] pl-1">Deposit</span>
                {bundlrData.showDeposit ? <BiChevronUp /> : <BiChevronDown />}
              </button>
            </span>
          </div>
        </div>
        {bundlrData.showDeposit && (
          <div className="flex items-end mt-2 space-x-2">
            <Input
              label="Amount to deposit"
              type="number"
              placeholder="100 MATIC"
              autoComplete="off"
              value={bundlrData.deposit || ''}
              onChange={(e) =>
                setBundlrData({
                  ...bundlrData,
                  deposit: parseInt(e.target.value)
                })
              }
            />
            <div>
              <Button
                type="button"
                disabled={bundlrData.depositing}
                onClick={() => depositToBundlr()}
                className="mb-0.5"
              >
                {bundlrData.depositing ? 'Loading...' : 'Deposit'}
              </Button>
            </div>
          </div>
        )}
      </div>
      <div className="text-[11px] inline-flex flex-col font-semibold">
        <span className="uppercase opacity-70">Estimated cost to upload</span>
        <span className="text-xl font-semibold">
          {bundlrData.estimatedPrice}
        </span>
      </div>
    </div>
  )
}

export default BundlrInfo
