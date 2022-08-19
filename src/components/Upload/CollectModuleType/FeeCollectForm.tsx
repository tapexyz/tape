import { useQuery } from '@apollo/client'
import { Button } from '@components/UIElements/Button'
import { Input } from '@components/UIElements/Input'
import { zodResolver } from '@hookform/resolvers/zod'
import useAppStore from '@lib/store'
import { WMATIC_TOKEN_ADDRESS } from '@utils/constants'
import { MODULES_CURRENCY_QUERY } from '@utils/gql/queries'
import clsx from 'clsx'
import React, { Dispatch, FC, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Erc20 } from 'src/types'
import { CollectModuleType, UploadedVideo } from 'src/types/local'
import { z } from 'zod'

type Props = {
  uploadedVideo: UploadedVideo
  // eslint-disable-next-line no-unused-vars
  setCollectType: (data: CollectModuleType) => void
  setShowModal: Dispatch<boolean>
}

const formSchema = z.object({
  currency: z.string(),
  amount: z.string().min(1, { message: 'Invalid amount' }),
  collectLimit: z.string().min(1, { message: 'Invalid collect limit' }),
  referralPercent: z
    .number()
    .max(100, { message: 'Percentage should be 0 to 100' })
    .nonnegative({ message: 'Should to greater than or equal to zero' })
})
export type FormData = z.infer<typeof formSchema>

const FeeCollectForm: FC<Props> = ({
  uploadedVideo,
  setCollectType,
  setShowModal
}) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    unregister
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      referralPercent: Number(uploadedVideo.collectModule.referralFee || 0),
      currency:
        uploadedVideo.collectModule.amount?.currency ?? WMATIC_TOKEN_ADDRESS,
      amount: uploadedVideo.collectModule.amount?.value,
      collectLimit: uploadedVideo.collectModule.collectLimit || '1'
    }
  })
  const selectedChannel = useAppStore((state) => state.selectedChannel)
  const [selectedCurrencySymbol, setSelectedCurrencySymbol] = useState('WMATIC')

  useEffect(() => {
    if (
      uploadedVideo.collectModule.isLimitedFeeCollect ||
      uploadedVideo.collectModule.isLimitedTimeFeeCollect
    ) {
      register('collectLimit')
    } else {
      unregister('collectLimit')
    }
  }, [uploadedVideo.collectModule, register, unregister])

  const getCurrencySymbol = (currencies: Erc20[], address: string) => {
    return currencies.find((c) => c.address === address)?.symbol as string
  }

  const { data: enabledCurrencies } = useQuery(MODULES_CURRENCY_QUERY, {
    variables: { request: { profileIds: selectedChannel?.id } },
    skip: !selectedChannel?.id
  })

  const onSubmit = (data: FormData) => {
    setCollectType({
      amount: { currency: data.currency, value: data.amount.toString() },
      referralFee: data.referralPercent,
      recipient: selectedChannel?.ownedBy,
      collectLimit: data.collectLimit
    })
    setShowModal(false)
  }

  return (
    <form className="space-y-3">
      <div>
        <div className="flex items-center mb-1 space-x-1.5">
          <div className="text-[11px] font-semibold uppercase opacity-70">
            Currency
          </div>
        </div>
        <select
          autoComplete="off"
          className={clsx(
            'bg-white text-sm p-2.5 rounded-xl dark:bg-gray-900 border border-gray-200 dark:border-gray-800 disabled:opacity-60 disabled:bg-gray-500 disabled:bg-opacity-20 outline-none w-full'
          )}
          {...register('currency')}
          value={uploadedVideo.collectModule.amount?.currency}
          onChange={(e) => {
            setCollectType({
              amount: { currency: e.target.value, value: '' }
            })
            setSelectedCurrencySymbol(
              getCurrencySymbol(
                enabledCurrencies.enabledModuleCurrencies,
                e.target.value
              )
            )
          }}
        >
          {enabledCurrencies?.enabledModuleCurrencies?.map(
            (currency: Erc20) => (
              <option key={currency.address} value={currency.address}>
                {currency.symbol}
              </option>
            )
          )}
        </select>
      </div>
      <div>
        <Input
          type="number"
          label="Amount"
          placeholder="1.5"
          min="0"
          autoComplete="off"
          max="100000"
          suffix={selectedCurrencySymbol}
          validationError={errors.amount?.message}
          {...register('amount', {
            setValueAs: (v) => String(v)
          })}
        />
      </div>
      <div>
        <Input
          label="Referral Percentage"
          type="number"
          placeholder="2"
          suffix="%"
          {...register('referralPercent', { valueAsNumber: true })}
          validationError={errors.referralPercent?.message}
        />
      </div>
      {uploadedVideo.collectModule.isLimitedFeeCollect ||
      uploadedVideo.collectModule.isLimitedTimeFeeCollect ? (
        <div>
          <Input
            type="number"
            label="Collect Limit"
            placeholder="3"
            min="0"
            autoComplete="off"
            validationError={errors.collectLimit?.message}
            {...register('collectLimit', {
              setValueAs: (v) => String(v)
            })}
          />
        </div>
      ) : null}
      <div className="flex justify-end">
        <Button type="button" onClick={() => handleSubmit(onSubmit)()}>
          Set Collect Type
        </Button>
      </div>
    </form>
  )
}

export default FeeCollectForm
