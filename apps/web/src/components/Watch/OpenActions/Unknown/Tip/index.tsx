import { useDid } from '@hooks/useDid'
import {
  ALLOWED_TOKEN_CURRENCIES,
  WMATIC_TOKEN_ADDRESS
} from '@tape.xyz/constants'
import {
  type ModuleMetadata,
  type UnknownOpenActionModuleSettings
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
import toast from 'react-hot-toast'
import { decodeAbiParameters, encodeAbiParameters, parseUnits } from 'viem'

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
  const [tip, setTip] = useState({ value: [5], currency: WMATIC_TOKEN_ADDRESS })

  const decoded = decodeAbiParameters(
    JSON.parse(metadata?.initializeCalldataABI ?? '{}'),
    action?.initializeCalldata
  )

  const { did } = useDid({
    address: decoded[0],
    enabled: Boolean(decoded[0])
  })

  const tipCurrency = ALLOWED_TOKEN_CURRENCIES?.find(
    (token) => token.address === tip.currency
  )

  if (!tipCurrency) {
    return toast.error('Currency not supported')
  }

  const onSendTip = () => {
    const calldata = encodeAbiParameters(
      JSON.parse(metadata?.processCalldataABI ?? '{}'),
      [
        tip.currency,
        parseUnits(tip.value.toString(), tipCurrency.decimals).toString()
      ]
    )
    actOnUnknownOpenAction(action.contract.address, calldata)
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
            {ALLOWED_TOKEN_CURRENCIES?.map((currency) => (
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
