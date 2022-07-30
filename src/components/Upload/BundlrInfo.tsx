import { WebBundlr } from '@bundlr-network/client'
import { Button } from '@components/UIElements/Button'
import { Input } from '@components/UIElements/Input'
import Tooltip from '@components/UIElements/Tooltip'
import logger from '@lib/logger'
import useAppStore from '@lib/store'
import * as Sentry from '@sentry/nextjs'
import {
  BUNDLR_CURRENCY,
  BUNDLR_WEBSITE_URL,
  POLYGON_CHAIN_ID
} from '@utils/constants'
import { parseToAtomicUnits } from '@utils/functions/parseToAtomicUnits'
import useIsMounted from '@utils/hooks/useIsMounted'
import { utils } from 'ethers'
import Link from 'next/link'
import React, { useEffect } from 'react'
import toast from 'react-hot-toast'
import { BiChevronDown, BiChevronUp } from 'react-icons/bi'
import { MdRefresh } from 'react-icons/md'
import { useAccount, useBalance, useSigner } from 'wagmi'

const BundlrInfo = () => {
  const { address } = useAccount()
  const { data: signer } = useSigner({
    onError(error: any) {
      toast.error(error?.data?.message ?? error?.message)
    }
  })
  const { uploadedVideo, getBundlrInstance, bundlrData, setBundlrData } =
    useAppStore()
  const { mounted } = useIsMounted()
  const { data: userBalance } = useBalance({
    addressOrName: address,
    chainId: POLYGON_CHAIN_ID
  })

  const fetchBalance = async (bundlr?: WebBundlr) => {
    const instance = bundlr || bundlrData.instance
    if (address && instance) {
      const balance = await instance.getBalance(address)
      setBundlrData({
        balance: utils.formatEther(balance.toString())
      })
    }
  }

  const estimatePrice = async (bundlr: WebBundlr) => {
    if (!uploadedVideo.buffer) return
    const price = await bundlr.utils.getPrice(
      BUNDLR_CURRENCY,
      uploadedVideo.buffer?.length
    )
    setBundlrData({
      estimatedPrice: utils.formatEther(price.toString())
    })
  }

  const initBundlr = async () => {
    if (signer?.provider && address && !bundlrData.instance) {
      toast('Estimating upload cost...')
      const bundlr = await getBundlrInstance(signer)
      if (bundlr) {
        setBundlrData({ instance: bundlr })
        await fetchBalance(bundlr)
        await estimatePrice(bundlr)
      }
    }
  }

  useEffect(() => {
    if (signer?.provider && mounted) initBundlr()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signer?.provider])

  useEffect(() => {
    if (bundlrData.instance && mounted) {
      fetchBalance(bundlrData.instance).catch((error) =>
        logger.error('[Error Fetch Bundlr Balance]', error)
      )
      estimatePrice(bundlrData.instance).catch((error) =>
        logger.error('[Error Estimate Video Price ]', error)
      )
    } else {
      initBundlr().catch((error) => logger.error('[Error Init Bundlr]', error))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bundlrData.instance])

  const depositToBundlr = async () => {
    if (!bundlrData.instance) return await initBundlr()
    if (!bundlrData.deposit) return toast.error('Enter deposit amount')
    const depositAmount = parseFloat(bundlrData.deposit)
    const value = parseToAtomicUnits(
      depositAmount,
      bundlrData.instance.currencyConfig.base[1]
    )
    if (!value) return toast.error('Invalid deposit amount')
    if (
      userBalance?.formatted &&
      parseFloat(userBalance?.formatted) < depositAmount
    )
      return toast.error('Insufficient funds in your wallet')
    setBundlrData({ depositing: true })
    try {
      const fundResult = await bundlrData.instance.fund(value)
      if (fundResult)
        toast.success(
          `Deposit of ${utils.formatEther(
            fundResult?.quantity
          )} is done and it will be reflected in few seconds.`
        )
    } catch (error: any) {
      toast.error('Failed to deposit')
      if (error.code !== 4001) Sentry.captureException(error)
    } finally {
      await fetchBalance()
      setBundlrData({
        deposit: null,
        showDeposit: false,
        depositing: false
      })
    }
  }

  return (
    <div className="w-full space-y-3">
      <div className="flex flex-col">
        <div className="inline-flex items-center justify-between text-xs font-semibold rounded opacity-70">
          <span className="flex items-center space-x-1.5">
            <span>Your Storage Balance</span>
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
            <a target="_blank" rel="noreferer" className="text-[11px]">
              {BUNDLR_CURRENCY}
            </a>
          </Link>
        </div>
        <div className="flex justify-between">
          <span className="text-lg font-medium">{bundlrData.balance}</span>
          <span>
            <button
              type="button"
              onClick={() =>
                setBundlrData({ showDeposit: !bundlrData.showDeposit })
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
          <div className="inline-flex flex-col text-xs font-medium opacity-70">
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
                setBundlrData({ deposit: e.target.value })
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
          Estimated Cost to Upload
        </span>
        <div className="text-lg font-medium">{bundlrData.estimatedPrice}</div>
      </div>
    </div>
  )
}

export default BundlrInfo
