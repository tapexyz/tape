import ChevronDownOutline from '@components/Common/Icons/ChevronDownOutline'
import ChevronUpOutline from '@components/Common/Icons/ChevronUpOutline'
import RefreshOutline from '@components/Common/Icons/RefreshOutline'
import { Button } from '@components/UIElements/Button'
import { Input } from '@components/UIElements/Input'
import Tooltip from '@components/UIElements/Tooltip'
import useEthersWalletClient from '@hooks/useEthersWalletClient'
import type { WebIrys } from '@irys/sdk'
import useAppStore from '@lib/store'
import { t, Trans } from '@lingui/macro'
import { Analytics, TRACK } from '@tape.xyz/browser'
import { IRYS_CURRENCY, POLYGON_CHAIN_ID } from '@tape.xyz/constants'
import { logger, useIsMounted } from '@tape.xyz/generic'
import React, { useEffect } from 'react'
import toast from 'react-hot-toast'
import { formatEther, parseEther, parseUnits } from 'viem'
import {
  useAccount,
  useBalance,
  usePrepareSendTransaction,
  useSendTransaction
} from 'wagmi'

const IrysInfo = () => {
  const { address } = useAccount()
  const { data: signer } = useEthersWalletClient()

  const uploadedVideo = useAppStore((state) => state.uploadedVideo)
  const getIrysInstance = useAppStore((state) => state.getIrysInstance)
  const irysData = useAppStore((state) => state.irysData)
  const setIrysData = useAppStore((state) => state.setIrysData)

  const { sendTransactionAsync } = useSendTransaction()
  const { config } = usePrepareSendTransaction()

  const { mounted } = useIsMounted()
  const { data: userBalance } = useBalance({
    address,
    chainId: POLYGON_CHAIN_ID,
    watch: true
  })

  const estimatePrice = async (irys: WebIrys) => {
    if (!uploadedVideo.stream) {
      return toast.error(t`Upload cost estimation failed`)
    }
    return await irys.utils.getPrice(IRYS_CURRENCY, uploadedVideo.stream?.size)
  }

  const fetchBalance = async (irys?: WebIrys) => {
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
    } catch (error) {
      logger.error('[Error Fetch Irys Balance]', error)
    }
  }

  const initIrys = async () => {
    if (signer && address && !irysData.instance) {
      const irys = await getIrysInstance(signer)
      if (irys) {
        setIrysData({ instance: irys })
        await fetchBalance(irys)
      }
    }
  }

  useEffect(() => {
    if (signer && mounted) {
      initIrys().catch((error) => logger.error('[Error Init Irys]', error))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signer, mounted])

  useEffect(() => {
    if (irysData.instance && mounted) {
      fetchBalance(irysData.instance).catch(() => {})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [irysData.instance])

  const depositToIrys = async () => {
    if (!irysData.instance) {
      return await initIrys()
    }
    if (!irysData.deposit) {
      return toast.error(t`Enter deposit amount`)
    }
    const depositAmount = parseFloat(irysData.deposit)
    const value = parseUnits(depositAmount.toString() as `${number}`, 9)
    if (!value || Number(value) < 1) {
      return toast.error(t`Invalid deposit amount`)
    }
    if (
      userBalance?.formatted &&
      parseFloat(userBalance?.formatted) < depositAmount
    ) {
      return toast.error(
        `Insufficient funds in your wallet, you have ${userBalance?.formatted} MATIC.`
      )
    }
    setIrysData({ depositing: true })

    // TEMP:START: override irys functions for viem
    irysData.instance.tokenConfig.getFee = async (): Promise<any> => {
      return 0
    }
    irysData.instance.tokenConfig.sendTx = async (data): Promise<string> => {
      const { hash } = await sendTransactionAsync(data)
      return hash
    }
    irysData.instance.tokenConfig.createTx = async (
      amount: `${number}`,
      to: `0x${string}`
    ): Promise<{ txId: string | undefined; tx: any }> => {
      config.to = to
      config.value = parseEther(amount.toString() as `${number}`, 'gwei')
      return { txId: undefined, tx: config }
    }
    // TEMP:END: override irys functions for viem

    try {
      const fundResult = await irysData.instance.fund(value.toString())
      if (fundResult) {
        toast.success(
          `Deposit of ${formatEther(
            BigInt(fundResult?.quantity)
          )} is done and it will be reflected in few seconds.`
        )
        Analytics.track(TRACK.DEPOSIT_MATIC)
      }
    } catch (error) {
      toast.error(t`Failed to deposit storage balance`)
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

  return (
    <div className="mt-4 w-full space-y-2">
      <div className="flex flex-col">
        <div className="inline-flex items-center justify-between rounded text-sm font-medium opacity-80">
          <span className="flex items-center space-x-1.5">
            <span>
              <Trans>Your Storage Balance</Trans>
            </span>
            <Tooltip content="Refresh balance" placement="top">
              <button
                type="button"
                className="focus:outline-none"
                onClick={() => onRefreshBalance()}
              >
                <RefreshOutline className="h-3 w-3" />
              </button>
            </Tooltip>
          </span>
          <span>
            <button
              type="button"
              onClick={() =>
                setIrysData({
                  showDeposit: !irysData.showDeposit
                })
              }
              className="inline-flex items-center rounded-full bg-gray-200 px-2 py-0.5 focus:outline-none dark:bg-gray-900"
            >
              <span className="px-0.5 text-xs">
                <Trans>Deposit</Trans>
              </span>
              {irysData.showDeposit ? (
                <ChevronUpOutline className="ml-1 h-3 w-3" />
              ) : (
                <ChevronDownOutline className="ml-1 h-3 w-3" />
              )}
            </button>
          </span>
        </div>
        <div className="flex justify-between">
          {irysData.balance !== '0' ? (
            <span className="text-lg font-medium">{irysData.balance}</span>
          ) : (
            <span className="mt-[6px] h-[22px] w-1/2 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
          )}
        </div>
      </div>
      {irysData.showDeposit && (
        <div>
          <div className="mb-2 inline-flex flex-col text-sm font-medium opacity-80">
            <Trans>Amount to deposit (MATIC)</Trans>
          </div>
          <div className="flex items-center space-x-2">
            <Input
              type="number"
              placeholder={userBalance?.formatted}
              className="py-1.5 md:py-2"
              autoComplete="off"
              min={0}
              value={irysData.deposit || ''}
              onChange={(e) => {
                setIrysData({ deposit: e.target.value })
              }}
            />
            <Button
              type="button"
              size="md"
              loading={irysData.depositing}
              onClick={() => depositToIrys()}
            >
              <Trans>Deposit</Trans>
            </Button>
          </div>
        </div>
      )}
      <div>
        <span className="inline-flex flex-col text-sm font-medium opacity-80">
          <Trans>Estimated Cost to Upload</Trans>
        </span>
        <div className="flex justify-between">
          {irysData.estimatedPrice !== '0' ? (
            <div className="text-lg font-medium">{irysData.estimatedPrice}</div>
          ) : (
            <span className="mt-[6px] h-[22px] w-1/2 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
          )}
        </div>
      </div>
    </div>
  )
}

export default IrysInfo
