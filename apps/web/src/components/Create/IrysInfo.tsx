import type { WebIrys } from '@irys/sdk'
import useAppStore from '@lib/store'
import { useIsMounted } from '@tape.xyz/browser'
import { IRYS_CURRENCY, POLYGON_CHAIN_ID } from '@tape.xyz/constants'
import { EVENTS, logger, Tower } from '@tape.xyz/generic'
import {
  Button,
  Callout,
  ChevronDownOutline,
  ChevronUpOutline,
  Input,
  RefreshOutline,
  Tooltip,
  WarningOutline
} from '@tape.xyz/ui'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { formatEther, formatGwei, formatUnits } from 'viem'
import { useAccount, useBalance, useWalletClient } from 'wagmi'

const IrysInfo = () => {
  const isMounted = useIsMounted()
  const { address } = useAccount()
  const { data: walletClient } = useWalletClient()

  const { data: userBalance } = useBalance({
    address,
    chainId: POLYGON_CHAIN_ID,
    query: {
      enabled: Boolean(address),
      refetchInterval: 2000
    }
  })

  const uploadedMedia = useAppStore((state) => state.uploadedMedia)
  const getIrysInstance = useAppStore((state) => state.getIrysInstance)
  const irysData = useAppStore((state) => state.irysData)
  const setIrysData = useAppStore((state) => state.setIrysData)
  const [fetchingBalance, setFetchingBalance] = useState(false)

  const estimatePrice = async (irys: WebIrys) => {
    if (!uploadedMedia.stream) {
      return toast.error('Upload cost estimation failed')
    }
    return await irys.utils.getPrice(IRYS_CURRENCY, uploadedMedia.stream?.size)
  }

  const fetchBalance = async (irys?: WebIrys) => {
    setFetchingBalance(true)
    try {
      const instance = irys || irysData.instance
      if (address && instance) {
        const balance = await instance.getBalance(address)
        const price = await estimatePrice(instance)
        setIrysData({
          balance: formatEther(BigInt(balance.toString())),
          estimatedPrice: formatEther(BigInt(price.toString()))
        })
      }
      setFetchingBalance(false)
    } catch (error) {
      setFetchingBalance(false)
      logger.error('[Error Fetch Irys Balance]', error)
    }
  }

  const initIrys = async () => {
    if (walletClient && address && !irysData.instance) {
      const irys = await getIrysInstance(walletClient)
      if (irys) {
        setIrysData({ instance: irys })
        await fetchBalance(irys)
      }
    }
  }

  useEffect(() => {
    if (walletClient && isMounted()) {
      initIrys().catch((error) => logger.error('[Error Init Irys]', error))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletClient, isMounted()])

  useEffect(() => {
    if (irysData.instance && isMounted()) {
      fetchBalance(irysData.instance).catch(() => {})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [irysData.instance])

  const depositToIrys = async () => {
    if (!irysData.instance) {
      return await initIrys()
    }
    if (!irysData.deposit) {
      return toast.error('Enter deposit amount')
    }
    const depositAmount = parseFloat(irysData.deposit)
    const fundValue = irysData.instance.utils.toAtomic(depositAmount)
    if (!fundValue || Number(fundValue) < 1) {
      return toast.error('Invalid deposit amount')
    }

    const formattedValue = formatUnits(
      userBalance?.value ?? BigInt(0),
      userBalance?.decimals as number
    )
    if (formattedValue && parseFloat(formattedValue) < depositAmount) {
      return toast.error(
        `Insufficient funds in your wallet, you have ${formattedValue} MATIC.`
      )
    }
    setIrysData({ depositing: true })

    try {
      const fundResult = await irysData.instance.fund(fundValue)
      if (fundResult) {
        toast.success(
          `Deposit of ${formatGwei(
            BigInt(fundResult?.quantity)
          )} ${IRYS_CURRENCY} is done and it will be reflected in few seconds.`
        )
        Tower.track(EVENTS.DEPOSIT_MATIC)
      }
    } catch (error) {
      toast.error('Failed to deposit storage balance')
      logger.error('[Error Irys Deposit]', error)
    } finally {
      await fetchBalance()
      setIrysData({
        deposit: null,
        showDeposit: false,
        depositing: false
      })
    }
  }

  const onRefreshBalance = async () => {
    if (!irysData.instance) {
      return await initIrys()
    }
    await fetchBalance()
  }

  const isEnoughBalanceAvailable = irysData.estimatedPrice < irysData.balance

  return (
    <div className="mt-4 w-full space-y-4">
      {!isEnoughBalanceAvailable && !fetchingBalance && irysData.instance ? (
        <Callout variant="danger" icon={<WarningOutline className="size-4" />}>
          Not enough storage balance available, deposit to continue.
        </Callout>
      ) : null}
      <div className="space-y-1">
        <span className="font-medium">Estimated cost to upload</span>
        <div className="flex justify-between">
          {!fetchingBalance ? (
            <span className="text-lg font-bold">
              {Number(irysData.estimatedPrice).toFixed(2)} matic
            </span>
          ) : (
            <span className="animate-shimmer mt-[6px] h-[22px] w-1/2 rounded-lg bg-gray-200 dark:bg-gray-700" />
          )}
        </div>
      </div>
      <div className="flex flex-col">
        <div className="inline-flex items-center justify-between rounded font-medium opacity-80">
          <span className="flex items-center space-x-1.5">
            <p>Your storage balance</p>
            <Tooltip content="Refresh balance" placement="top">
              <button
                type="button"
                className="focus:outline-none"
                onClick={() => onRefreshBalance()}
              >
                <RefreshOutline className="size-3" />
              </button>
            </Tooltip>
          </span>
          <span>
            <Button
              size="sm"
              type="button"
              variant="secondary"
              onClick={() =>
                setIrysData({
                  showDeposit: !irysData.showDeposit
                })
              }
            >
              <span className="flex items-center space-x-1.5">
                <span>Deposit</span>
                {irysData.showDeposit ? (
                  <ChevronUpOutline className="size-3" />
                ) : (
                  <ChevronDownOutline className="size-3" />
                )}
              </span>
            </Button>
          </span>
        </div>
        <div className="flex justify-between">
          {!fetchingBalance ? (
            <span className="text-lg font-bold">
              {Number(irysData.balance).toFixed(2)} matic
            </span>
          ) : (
            <span className="animate-shimmer mt-[6px] h-[22px] w-1/2 rounded-lg bg-gray-200 dark:bg-gray-700" />
          )}
        </div>
      </div>
      {irysData.showDeposit && (
        <div className="space-y-1">
          <span className="font-medium">Amount to deposit (MATIC)</span>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder={userBalance?.formatted}
              className="py-1.5 md:py-2"
              autoComplete="off"
              min={0}
              value={irysData.deposit ?? ''}
              onChange={(e) => {
                setIrysData({ deposit: e.target.value })
              }}
            />
            <Button
              type="button"
              variant="secondary"
              loading={irysData.depositing}
              disabled={irysData.depositing}
              onClick={() => depositToIrys()}
            >
              Deposit
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default IrysInfo
