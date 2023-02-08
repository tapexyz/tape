import type { WebBundlr } from '@bundlr-network/client'
import ChevronDownOutline from '@components/Common/Icons/ChevronDownOutline'
import ChevronUpOutline from '@components/Common/Icons/ChevronUpOutline'
import { Button } from '@components/UIElements/Button'
import { Input } from '@components/UIElements/Input'
import Tooltip from '@components/UIElements/Tooltip'
import useAppStore from '@lib/store'
import { utils } from 'ethers'
import React, { useEffect } from 'react'
import toast from 'react-hot-toast'
import { MdRefresh } from 'react-icons/md'
import type { CustomErrorWithData } from 'utils'
import {
  Analytics,
  BUNDLR_CONNECT_MESSAGE,
  BUNDLR_CURRENCY,
  POLYGON_CHAIN_ID,
  TRACK
} from 'utils'
import useIsMounted from 'utils/hooks/useIsMounted'
import logger from 'utils/logger'
import { useAccount, useBalance, useSigner } from 'wagmi'

const BundlrInfo = () => {
  const { address } = useAccount()
  const { data: signer } = useSigner({
    onError: (error: CustomErrorWithData) => {
      toast.error(error?.data?.message ?? error?.message)
    }
  })
  const uploadedVideo = useAppStore((state) => state.uploadedVideo)
  const getBundlrInstance = useAppStore((state) => state.getBundlrInstance)
  const bundlrData = useAppStore((state) => state.bundlrData)
  const setBundlrData = useAppStore((state) => state.setBundlrData)

  const { mounted } = useIsMounted()
  const { data: userBalance } = useBalance({
    address,
    chainId: POLYGON_CHAIN_ID,
    watch: true
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
    if (!uploadedVideo.stream) {
      return toast.error('Upload cost estimation failed!')
    }
    const price = await bundlr.utils.getPrice(
      BUNDLR_CURRENCY,
      uploadedVideo.stream?.size
    )
    setBundlrData({
      estimatedPrice: utils.formatEther(price.toString())
    })
  }

  const initBundlr = async () => {
    if (signer?.provider && address && !bundlrData.instance) {
      toast(BUNDLR_CONNECT_MESSAGE)
      const bundlr = await getBundlrInstance(signer)
      if (bundlr) {
        setBundlrData({ instance: bundlr })
        await fetchBalance(bundlr)
        await estimatePrice(bundlr)
      }
    }
  }

  useEffect(() => {
    if (signer?.provider && mounted) {
      initBundlr().catch((error) => logger.error('[Error Init Bundlr]', error))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signer?.provider, mounted])

  useEffect(() => {
    if (bundlrData.instance && mounted) {
      fetchBalance(bundlrData.instance).catch((error) =>
        logger.error('[Error Fetch Bundlr Balance]', error)
      )
      estimatePrice(bundlrData.instance).catch((error) =>
        logger.error('[Error Estimate Video Price ]', error)
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bundlrData.instance])

  const depositToBundlr = async () => {
    if (!bundlrData.instance) {
      return await initBundlr()
    }
    if (!bundlrData.deposit) {
      return toast.error('Enter deposit amount')
    }
    const depositAmount = parseFloat(bundlrData.deposit)
    const value = utils.parseUnits(depositAmount.toString())._hex
    if (!value || Number(value) < 1) {
      return toast.error('Invalid deposit amount')
    }
    if (
      userBalance?.formatted &&
      parseFloat(userBalance?.formatted) < depositAmount
    ) {
      return toast.error(
        `Insufficient funds in your wallet, you have ${userBalance?.formatted} MATIC.`
      )
    }
    setBundlrData({ depositing: true })
    try {
      const fundResult = await bundlrData.instance.fund(value)
      if (fundResult) {
        toast.success(
          `Deposit of ${utils.formatEther(
            fundResult?.quantity
          )} is done and it will be reflected in few seconds.`
        )
        Analytics.track(TRACK.DEPOSIT_MATIC)
      }
    } catch (error) {
      toast.error('Failed to deposit storage balance.')
      logger.error('[Error Bundlr Deposit]', error)
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
    <div className="mt-4 w-full space-y-2">
      <div className="flex flex-col">
        <div className="inline-flex items-center justify-between rounded text-xs font-semibold opacity-70">
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
          <span>
            <button
              type="button"
              onClick={() =>
                setBundlrData({ showDeposit: !bundlrData.showDeposit })
              }
              className="inline-flex items-center rounded-full bg-gray-200 py-0.5 px-2 focus:outline-none dark:bg-gray-900"
            >
              <span className="px-0.5 text-xs">Deposit</span>
              {bundlrData.showDeposit ? (
                <ChevronUpOutline className="ml-1 h-3 w-3" />
              ) : (
                <ChevronDownOutline className="ml-1 h-3 w-3" />
              )}
            </button>
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-lg font-medium">{bundlrData.balance}</span>
        </div>
      </div>
      {bundlrData.showDeposit && (
        <div>
          <div className="inline-flex flex-col text-xs font-medium opacity-70">
            Amount to deposit (MATIC)
          </div>
          <div className="flex items-center space-x-2">
            <Input
              type="number"
              placeholder={userBalance?.formatted}
              className="py-2"
              autoComplete="off"
              min={0}
              value={bundlrData.deposit || ''}
              onChange={(e) => {
                setBundlrData({ deposit: e.target.value })
              }}
            />
            <Button
              size="md"
              loading={bundlrData.depositing}
              onClick={() => depositToBundlr()}
            >
              Deposit
            </Button>
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
