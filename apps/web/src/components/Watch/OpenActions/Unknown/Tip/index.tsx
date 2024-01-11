import { useDid } from '@hooks/useDid'
import useProfileStore from '@lib/store/idb/profile'
import { WMATIC_TOKEN_ADDRESS } from '@tape.xyz/constants'
import {
  LimitType,
  type ModuleMetadata,
  type UnknownOpenActionModuleSettings,
  useEnabledCurrenciesQuery
} from '@tape.xyz/lens'
import {
  Button,
  RangeSlider,
  Select,
  SelectItem,
  TipOutline
} from '@tape.xyz/ui'
import type { FC } from 'react'
import React, { useState } from 'react'
import { decodeAbiParameters, encodeAbiParameters } from 'viem'

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
  const activeProfile = useProfileStore((state) => state.activeProfile)
  const [tip, setTip] = useState({ value: [5], currency: WMATIC_TOKEN_ADDRESS })

  const abi = JSON.parse(metadata?.initializeCalldataABI ?? [])
  const decoded = decodeAbiParameters(abi, action?.initializeCalldata)

  const { did } = useDid({
    address: decoded[0],
    enabled: Boolean(decoded[0])
  })

  const { data: enabledCurrencies } = useEnabledCurrenciesQuery({
    variables: {
      request: {
        limit: LimitType.Fifty
      }
    },
    skip: !activeProfile?.id
  })

  const onSendTip = () => {
    const calldata = encodeAbiParameters(abi, [
      tip.currency,
      tip.value.toString()
    ])
    actOnUnknownOpenAction(action.contract.address, calldata)
  }

  return (
    <div className="space-y-4">
      <h6>
        Send a tip to <b>@{did}</b>
      </h6>

      <div className="flex items-center justify-between space-x-4">
        <RangeSlider
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
            {enabledCurrencies?.currencies.items?.map((currency) => (
              <SelectItem
                key={currency.contract.address}
                value={currency.contract.address}
              >
                {currency.symbol}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          loading={acting}
          disabled={acting}
          onClick={() => onSendTip()}
          icon={<TipOutline className="size-4" />}
        >
          Send
        </Button>
      </div>
    </div>
  )
}

export default TipOpenAction
