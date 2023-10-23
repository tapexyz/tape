import ChevronDownOutline from '@components/Common/Icons/ChevronDownOutline'
import ChevronUpOutline from '@components/Common/Icons/ChevronUpOutline'
import RefreshOutline from '@components/Common/Icons/RefreshOutline'
import WarningOutline from '@components/Common/Icons/WarningOutline'
import { Input } from '@components/UIElements/Input'
import Tooltip from '@components/UIElements/Tooltip'
import useEthersWalletClient from '@hooks/useEthersWalletClient'
import type { WebIrys } from '@irys/sdk'
import useAppStore from '@lib/store'
import { t, Trans } from '@lingui/macro'
import { Button, Callout, Flex, IconButton, Text } from '@radix-ui/themes'
import { Analytics, TRACK, useIsMounted } from '@tape.xyz/browser'
import { IRYS_CURRENCY, POLYGON_CHAIN_ID } from '@tape.xyz/constants'
import { logger } from '@tape.xyz/generic'
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

  const isEnoughBalanceAvailable = irysData.estimatedPrice < irysData.balance

  return (
    <div className="mt-4 w-full space-y-4">
      {!isEnoughBalanceAvailable && (
        <Callout.Root color="red">
          <Callout.Icon>
            <WarningOutline className="h-4 w-4" />
          </Callout.Icon>
          <Callout.Text>
            <Trans>
              Not enough storage balance available, deposit to continue.
            </Trans>
          </Callout.Text>
        </Callout.Root>
      )}
      <div className="flex flex-col">
        <div className="inline-flex items-center justify-between rounded font-medium opacity-80">
          <span className="flex items-center space-x-1.5">
            <Text>
              <Trans>Your storage balance</Trans>
            </Text>
            <Tooltip content="Refresh balance" placement="top">
              <IconButton
                size="1"
                variant="soft"
                type="button"
                className="focus:outline-none"
                onClick={() => onRefreshBalance()}
              >
                <RefreshOutline className="h-3 w-3" />
              </IconButton>
            </Tooltip>
          </span>
          <span>
            <Button
              type="button"
              size="1"
              variant="soft"
              onClick={() =>
                setIrysData({
                  showDeposit: !irysData.showDeposit
                })
              }
            >
              <Text>
                <Trans>Deposit</Trans>
              </Text>
              {irysData.showDeposit ? (
                <ChevronUpOutline className="ml-1 h-3 w-3" />
              ) : (
                <ChevronDownOutline className="ml-1 h-3 w-3" />
              )}
            </Button>
          </span>
        </div>
        <div className="flex justify-between">
          {irysData.balance !== '0' ? (
            <Text weight="bold" size="4">
              {Number(irysData.balance).toFixed(2)} matic
            </Text>
          ) : (
            <span className="mt-[6px] h-[22px] w-1/2 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
          )}
        </div>
      </div>
      {irysData.showDeposit && (
        <div className="space-y-1">
          <Text weight="medium">
            <Trans>Amount to deposit (MATIC)</Trans>
          </Text>
          <Flex gap="2">
            <Input
              type="number"
              placeholder={userBalance?.formatted}
              className="py-1.5 md:py-2"
              autoComplete="off"
              min={0}
              value={
                irysData.deposit || Number(irysData.estimatedPrice).toFixed(2)
              }
              onChange={(e) => {
                setIrysData({ deposit: e.target.value })
              }}
            />
            <Button
              type="button"
              variant="outline"
              highContrast
              disabled={irysData.depositing}
              onClick={() => depositToIrys()}
            >
              <Trans>Deposit</Trans>
            </Button>
          </Flex>
        </div>
      )}
      <div className="space-y-1">
        <Text weight="medium">
          <Trans>Estimated cost to upload</Trans>
        </Text>
        <div className="flex justify-between">
          {irysData.estimatedPrice !== '0' ? (
            <Text weight="bold" size="4">
              {Number(irysData.estimatedPrice).toFixed(2)} matic
            </Text>
          ) : (
            <span className="mt-[6px] h-[22px] w-1/2 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
          )}
        </div>
      </div>
    </div>
  )
}

export default IrysInfo
