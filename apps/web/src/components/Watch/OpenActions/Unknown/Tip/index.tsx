import { useDid } from '@hooks/useDid'
import useAllowedTokensStore from '@lib/store/idb/tokens'
import { WMATIC_TOKEN_ADDRESS } from '@tape.xyz/constants'
import {
  type ModuleMetadata,
  type UnknownOpenActionModuleSettings,
  useApprovedModuleAllowanceAmountQuery
} from '@tape.xyz/lens'
import {
  Button,
  RangeSlider,
  Select,
  SelectItem,
  TipOutline
} from '@tape.xyz/ui'
import type { FC } from 'react'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import {
  decodeAbiParameters,
  encodeAbiParameters,
  formatUnits,
  parseUnits
} from 'viem'
import { useAccount, useBalance } from 'wagmi'

import BalanceAlert from '../../BalanceAlert'
import PermissionAlert from '../../PermissionAlert'

type Props = {
  metadata: ModuleMetadata
  action: UnknownOpenActionModuleSettings
  acting: boolean
  actOnUnknownOpenAction: (address: string, data: string) => void
}

const TipOpenAction: FC<Props> = ({
  metadata,
  action,
  acting,
  actOnUnknownOpenAction
}) => {
  const { address } = useAccount()
  const [tip, setTip] = useState({ value: [5], currency: WMATIC_TOKEN_ADDRESS })
  const [isAllowed, setIsAllowed] = useState(true)
  const [haveEnoughBalance, setHaveEnoughBalance] = useState(false)

  const allowedTokens = useAllowedTokensStore((state) => state.allowedTokens)

  const decoded = decodeAbiParameters(
    JSON.parse(metadata?.initializeCalldataABI ?? '{}'),
    action?.initializeCalldata
  )

  const { did } = useDid({
    address: decoded[0],
    enabled: Boolean(decoded[0])
  })

  const tipCurrency = allowedTokens?.find(
    (token) => token.address === tip.currency
  )

  const {
    loading: allowanceLoading,
    data: allowanceData,
    refetch: refetchAllowance
  } = useApprovedModuleAllowanceAmountQuery({
    variables: {
      request: {
        currencies: [tipCurrency?.address],
        unknownOpenActionModules: [action?.contract.address]
      }
    },
    skip: !tipCurrency?.address || !action?.contract.address,
    onCompleted: (data) => {
      setIsAllowed(
        parseFloat(data.approvedModuleAllowanceAmount[0].allowance.value) >
          tip.value[0]
      )
    }
  })

  const { data: balanceData, isLoading: balanceLoading } = useBalance({
    address,
    query: {
      enabled: Boolean(tipCurrency?.address),
      refetchInterval: 2000
    },
    token: tipCurrency?.address as `0x${string}`
  })

  useEffect(() => {
    if (
      balanceData &&
      tip.value &&
      parseFloat(
        formatUnits(balanceData.value, tipCurrency?.decimals as number)
      ) < parseFloat(String(tip.value[0]))
    ) {
      setHaveEnoughBalance(false)
    } else {
      setHaveEnoughBalance(true)
    }
    if (tipCurrency?.address) {
      refetchAllowance()
    }
  }, [balanceData, tipCurrency, refetchAllowance, tip.value])

  const onSendTip = () => {
    if (!tipCurrency) {
      return toast.error('Currency not supported')
    }
    try {
      const abi = JSON.parse(metadata?.processCalldataABI ?? '{}')
      const calldata = encodeAbiParameters(abi, [
        tip.currency,
        parseUnits(tip.value.toString(), tipCurrency.decimals).toString()
      ])
      actOnUnknownOpenAction(action.contract.address, calldata)
    } catch {}
  }

  const getButton = () => {
    if (!tipCurrency) {
      return toast.error('Currency not supported')
    }

    if (balanceLoading || allowanceLoading) {
      return <Button disabled>Checking...</Button>
    }

    if (!isAllowed) {
      return (
        <PermissionAlert
          isAllowed={isAllowed}
          setIsAllowed={setIsAllowed}
          allowanceModule={
            allowanceData?.approvedModuleAllowanceAmount[0] as any
          }
        />
      )
    }

    if (!haveEnoughBalance) {
      return (
        <BalanceAlert
          currencyName={tipCurrency.symbol}
          address={tipCurrency.address}
          value={String(tip.value[0])}
        />
      )
    }
    return (
      <Button
        loading={acting}
        disabled={acting}
        onClick={() => onSendTip()}
        icon={<TipOutline className="size-4" />}
      >
        Send
      </Button>
    )
  }

  return (
    <div className="space-y-4">
      <h6>
        Send a tip to <b>@{did}</b>
      </h6>

      <div className="flex items-center justify-between space-x-4">
        <RangeSlider
          min={1}
          value={tip.value}
          onValueChange={(value) => setTip({ ...tip, value })}
        />
        <div>
          <Select
            size="sm"
            value={tip.currency}
            onValueChange={(currency) => {
              setTip({ ...tip, currency })
            }}
          >
            {allowedTokens?.map((currency) => (
              <SelectItem
                size="sm"
                key={currency.address}
                value={currency.address}
              >
                {currency.symbol}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>

      <div className="flex justify-end">{getButton()}</div>
    </div>
  )
}

export default TipOpenAction
