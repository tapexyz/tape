import { zodResolver } from '@hookform/resolvers/zod'
import useAppStore from '@lib/store'
import useProfileStore from '@lib/store/idb/profile'
import useAllowedTokensStore from '@lib/store/idb/tokens'
import { WMATIC_TOKEN_ADDRESS } from '@tape.xyz/constants'
import type { CollectModuleType } from '@tape.xyz/lens/custom-types'
import { Button, Input, Select, SelectItem } from '@tape.xyz/ui'
import type { Dispatch, FC } from 'react'
import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { isAddress } from 'viem'
import type { z } from 'zod'
import { number, object, string } from 'zod'

import Splits from './Splits'

type Props = {
  setCollectType: (data: CollectModuleType) => void
  setShowModal: Dispatch<boolean>
}

const formSchema = object({
  currency: string(),
  amount: string().min(1, { message: `Invalid amount` }).optional(),
  referralPercent: number()
    .max(100, { message: `Percentage should be 0 to 100` })
    .nonnegative({ message: `Should to greater than or equal to zero` })
})
export type FormData = z.infer<typeof formSchema>

const FeeCollectForm: FC<Props> = ({ setCollectType, setShowModal }) => {
  const submitContainerRef = useRef<HTMLDivElement>(null)
  const [validationError, setValidationError] = useState('')

  const uploadedMedia = useAppStore((state) => state.uploadedMedia)
  const activeProfile = useProfileStore((state) => state.activeProfile)
  const allowedTokens = useAllowedTokensStore((state) => state.allowedTokens)

  const splitRecipients = uploadedMedia.collectModule.multiRecipients ?? []

  const {
    register,
    formState: { errors },
    handleSubmit,
    setError
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      referralPercent: Number(uploadedMedia.collectModule.referralFee || 0),
      currency:
        uploadedMedia.collectModule.amount?.currency ?? WMATIC_TOKEN_ADDRESS,
      amount: uploadedMedia.collectModule.amount?.value || '0'
    }
  })

  useEffect(() => {
    setValidationError('')
  }, [uploadedMedia.collectModule.multiRecipients])

  const onSubmit = (data: FormData) => {
    setCollectType({
      amount: {
        currency: data.currency,
        value: data.amount || '0'
      },
      referralFee: data.referralPercent,
      recipient: activeProfile?.ownedBy.address
    })
    setShowModal(false)
  }

  const validateInputs = (data: FormData) => {
    const amount = Number(data.amount)
    const { isFeeCollect } = uploadedMedia.collectModule
    if (isFeeCollect) {
      if (amount === 0) {
        return setError('amount', {
          message: `Amount should be greater than 0`
        })
      }
      if (splitRecipients.length > 5) {
        return setValidationError('Only 5 splits supported')
      }
      const splitsSum = splitRecipients.reduce(
        (total, obj) => obj.split + total,
        0
      )
      const invalidSplitAddresses = splitRecipients.filter(
        (splitRecipient) => !isAddress(splitRecipient.recipient)
      )
      if (invalidSplitAddresses.length) {
        return setValidationError('Invalid split recipient address')
      }
      const uniqueValues = new Set(splitRecipients.map((v) => v.recipient))
      if (uniqueValues.size < splitRecipients.length) {
        return setValidationError('Split addresses should be unique')
      }
      if (
        uploadedMedia.collectModule.isMultiRecipientFeeCollect &&
        splitsSum !== 100
      ) {
        return setValidationError('Sum of all splits should be 100%')
      }
      data.amount = String(amount)
    }
    onSubmit(data)
  }

  return (
    <form className="space-y-3">
      {uploadedMedia.collectModule.isFeeCollect ? (
        <>
          <div className="flex items-start gap-2">
            <Input
              type="number"
              placeholder="1.5"
              min="0"
              autoComplete="off"
              max="100000"
              error={errors.amount?.message}
              {...register('amount', {
                setValueAs: (v) => String(v)
              })}
            />
            <div>
              <Select
                {...register('currency')}
                value={uploadedMedia.collectModule.amount?.currency}
                onValueChange={(value) => {
                  setCollectType({
                    amount: { currency: value, value: '' }
                  })
                }}
              >
                {allowedTokens?.map((currency) => (
                  <SelectItem key={currency.address} value={currency.address}>
                    {currency.symbol}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </div>

          <Splits submitContainerRef={submitContainerRef} />

          <div>
            <Input
              label="Referral Percentage"
              type="number"
              placeholder="2"
              suffix="%"
              info="Percentage of collect revenue from mirrors can be shared with the referrer"
              {...register('referralPercent', { valueAsNumber: true })}
              error={errors.referralPercent?.message}
            />
          </div>
        </>
      ) : null}
      <div
        className="flex items-center justify-between pt-4"
        ref={submitContainerRef}
      >
        <span className="text-sm font-medium text-red-500">
          {validationError}
        </span>
        <Button type="button" onClick={() => handleSubmit(validateInputs)()}>
          Set Collect Type
        </Button>
      </div>
    </form>
  )
}

export default FeeCollectForm
