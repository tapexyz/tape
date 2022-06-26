import { WebBundlr } from '@bundlr-network/client'
import { Button } from '@components/UIElements/Button'
import { Input } from '@components/UIElements/Input'
import Tooltip from '@components/UIElements/Tooltip'
import useAppStore from '@lib/store'
import * as Sentry from '@sentry/nextjs'
import { BUNDLR_CURRENCY, BUNDLR_WEBSITE_URL } from '@utils/constants'
import { parseToAtomicUnits } from '@utils/functions/parseToAtomicUnits'
import { utils } from 'ethers'
import Link from 'next/link'
import React, { useEffect } from 'react'
import toast from 'react-hot-toast'
import { BiChevronDown, BiChevronUp } from 'react-icons/bi'
import { MdRefresh } from 'react-icons/md'
import { BundlrDataState } from 'src/types/local'
import { useAccount, useSigner } from 'wagmi'

const BundlrInfo = () => {
  const { data: account } = useAccount()
  const { data: signer } = useSigner()
  const { uploadedVideo, getBundlrInstance, bundlrData, setBundlrData } =
    useAppStore()

  useEffect(() => {
    initBundlr()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const initBundlr = async () => {
    if (signer?.provider && account?.address) {
      const bundlr = await getBundlrInstance(signer)
      if (bundlr) {
        let data: BundlrDataState = bundlrData
        data.instance = bundlr
        setBundlrData(data)
        await fetchBalance(bundlr)
        await estimatePrice(bundlr)
      }
    }
  }

  const depositToBundlr = async () => {
    if (bundlrData.instance && bundlrData.deposit) {
      const value = parseToAtomicUnits(
        parseFloat(bundlrData.deposit),
        bundlrData.instance.currencyConfig.base[1]
      )
      if (!value) return toast.error('Invalid deposit amount')
      setBundlrData({ ...bundlrData, depositing: true })
      await bundlrData.instance
        .fund(value)
        .then((res) => {
          toast.success(
            `Deposit of ${utils.formatEther(res?.quantity)} is done!`
          )
        })
        .catch((e) => {
          toast.error(`Failed to deposit`)
          Sentry.captureException(e)
        })
        .finally(async () => {
          fetchBalance()
          setBundlrData({
            ...bundlrData,
            deposit: null,
            showDeposit: false,
            depositing: false
          })
        })
    }
  }

  const fetchBalance = async (bundlr?: WebBundlr) => {
    const instance = bundlr || bundlrData.instance
    if (account?.address && instance) {
      const balance = await instance.getBalance(account.address)
      let data: BundlrDataState = bundlrData
      data.balance = utils.formatEther(balance.toString())
      setBundlrData(data)
    }
  }

  const estimatePrice = async (bundlr: WebBundlr) => {
    if (!uploadedVideo.buffer) return
    const price = await bundlr.utils.getPrice(
      BUNDLR_CURRENCY,
      uploadedVideo.buffer.length
    )
    let data: BundlrDataState = bundlrData
    data.estimatedPrice = utils.formatEther(price.toString())
    setBundlrData(data)
  }

  return (
    <div className="w-full space-y-3">
      <div className="flex flex-col">
        <div className="inline-flex items-center justify-between text-xs font-semibold rounded opacity-70">
          <span className="flex items-center space-x-1.5">
            <span>Your Balance</span>
            <Tooltip content="Refresh balance" placement="top">
              <button
                type="button"
                className="focus:outline-none"
                onClick={() => fetchBalance()}
              >
                <MdRefresh className="text-sm" />
              </button>
            </Tooltip>
          </span>
          <Link href={BUNDLR_WEBSITE_URL}>
            <a
              target="_blank"
              rel="noreferer"
              className="text-[11px] uppercase"
            >
              {BUNDLR_CURRENCY}
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
              className="inline-flex py-0.5 items-center pl-1.5 pr-0.5 bg-gray-100 rounded-full focus:outline-none dark:bg-gray-800"
            >
              <span className="text-xs px-0.5">Deposit</span>
              {bundlrData.showDeposit ? <BiChevronUp /> : <BiChevronDown />}
            </button>
          </span>
        </div>
      </div>
      {bundlrData.showDeposit && (
        <div>
          <div className="inline-flex flex-col text-xs font-semibold opacity-70">
            Amount to deposit
          </div>
          <div className="flex items-end space-x-2">
            <Input
              type="number"
              placeholder="100 MATIC"
              className="!py-1.5"
              autoComplete="off"
              min={0}
              value={bundlrData.deposit || ''}
              onChange={(e) => {
                setBundlrData({
                  ...bundlrData,
                  deposit: e.target.value
                })
              }}
            />
            <div>
              <Button
                type="button"
                disabled={bundlrData.depositing}
                onClick={() => depositToBundlr()}
                className="mb-0.5 !py-1.5"
              >
                {bundlrData.depositing ? 'Loading...' : 'Deposit'}
              </Button>
            </div>
          </div>
        </div>
      )}
      <div>
        <span className="inline-flex flex-col text-xs font-semibold opacity-70">
          Estimated cost to upload
        </span>
        <div className="text-xl font-semibold">{bundlrData.estimatedPrice}</div>
      </div>
    </div>
  )
}

export default BundlrInfo
