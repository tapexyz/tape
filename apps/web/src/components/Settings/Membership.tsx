import { LENSHUB_PROXY_ABI } from '@abis/LensHubProxy'
import AddressExplorerLink from '@components/Common/Links/AddressExplorerLink'
import { Button } from '@components/UIElements/Button'
import { Input } from '@components/UIElements/Input'
import { Loader } from '@components/UIElements/Loader'
import { zodResolver } from '@hookform/resolvers/zod'
import usePendingTxn from '@hooks/usePendingTxn'
import {
  ERROR_MESSAGE,
  LENSHUB_PROXY_ADDRESS,
  REQUESTING_SIGNATURE_MESSAGE,
  WMATIC_TOKEN_ADDRESS
} from '@lenstube/constants'
import type {
  CreateSetFollowModuleBroadcastItemResult,
  Erc20,
  FeeFollowModuleSettings,
  Profile
} from '@lenstube/lens'
import {
  useBroadcastMutation,
  useCreateSetFollowModuleTypedDataMutation,
  useEnabledModuleCurrrenciesQuery,
  useProfileFollowModuleQuery
} from '@lenstube/lens'
import type { CustomErrorWithData } from '@lenstube/lens/custom-types'
import useChannelStore from '@lib/store/channel'
import { t, Trans } from '@lingui/macro'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import getSignature from 'utils/functions/getSignature'
import { shortenAddress } from 'utils/functions/shortenAddress'
import { useContractWrite, useSignTypedData } from 'wagmi'
import { z } from 'zod'

type Props = {
  channel: Profile
}

const formSchema = z.object({
  recipient: z.string().length(42, { message: 'Enter valid ethereum address' }),
  amount: z
    .number()
    .nonnegative({ message: 'Amount should to greater than zero' })
    .refine((n) => n > 0, { message: 'Amount should be greater than 0' }),
  token: z.string().length(42, { message: 'Select valid token' })
})
type FormData = z.infer<typeof formSchema>

const Membership = ({ channel }: Props) => {
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const userSigNonce = useChannelStore((state) => state.userSigNonce)
  const setUserSigNonce = useChannelStore((state) => state.setUserSigNonce)

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    watch,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recipient: channel.ownedBy,
      token: WMATIC_TOKEN_ADDRESS
    }
  })

  const onError = (error: CustomErrorWithData) => {
    toast.error(error?.data?.message ?? error?.message ?? ERROR_MESSAGE)
    setLoading(false)
  }

  const {
    data: followModuleData,
    refetch,
    loading: moduleLoading
  } = useProfileFollowModuleQuery({
    variables: { request: { profileIds: channel?.id } },
    skip: !channel?.id,
    onCompleted(data) {
      const activeFollowModule = data?.profiles?.items[0]
        ?.followModule as FeeFollowModuleSettings
      setShowForm(activeFollowModule ? false : true)
    }
  })
  const activeFollowModule = followModuleData?.profiles?.items[0]
    ?.followModule as FeeFollowModuleSettings

  const { signTypedDataAsync } = useSignTypedData({
    onError
  })
  const { data: enabledCurrencies } = useEnabledModuleCurrrenciesQuery({
    variables: { request: { profileIds: channel?.id } },
    skip: !channel?.id
  })

  const [broadcast, { data: broadcastData }] = useBroadcastMutation({
    onError
  })

  const { data: writtenData, write } = useContractWrite({
    address: LENSHUB_PROXY_ADDRESS,
    abi: LENSHUB_PROXY_ABI,
    functionName: 'setFollowModule',
    onError
  })

  const { indexed } = usePendingTxn({
    txHash: writtenData?.hash,
    txId:
      broadcastData?.broadcast.__typename === 'RelayerResult'
        ? broadcastData?.broadcast?.txId
        : undefined
  })

  useEffect(() => {
    if (indexed) {
      setLoading(false)
      toast.success(t`Membership updated`)
      setShowForm(false)
      refetch({ request: { profileIds: channel?.id } })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indexed])

  const [createSetFollowModuleTypedData] =
    useCreateSetFollowModuleTypedDataMutation({
      onCompleted: async ({ createSetFollowModuleTypedData }) => {
        const { typedData, id } =
          createSetFollowModuleTypedData as CreateSetFollowModuleBroadcastItemResult
        try {
          toast.loading(REQUESTING_SIGNATURE_MESSAGE)
          const signature = await signTypedDataAsync(getSignature(typedData))
          setUserSigNonce(userSigNonce + 1)
          const { data } = await broadcast({
            variables: { request: { id, signature } }
          })
          if (data?.broadcast?.__typename === 'RelayError') {
            const { profileId, followModule, followModuleInitData } =
              typedData.value
            return write?.({
              args: [profileId, followModule, followModuleInitData]
            })
          }
        } catch {
          setLoading(false)
        }
      },
      onError
    })

  const setMembership = (freeFollowModule: boolean) => {
    setLoading(true)
    createSetFollowModuleTypedData({
      variables: {
        options: { overrideSigNonce: userSigNonce },
        request: {
          profileId: channel?.id,
          followModule: freeFollowModule
            ? { freeFollowModule: true }
            : {
                feeFollowModule: {
                  amount: {
                    currency: getValues('token'),
                    value: getValues('amount').toString()
                  },
                  recipient: getValues('recipient')
                }
              }
        }
      }
    })
  }

  const onSubmitForm = () => {
    setMembership(false)
  }

  return (
    <div className="dark:bg-theme rounded-xl bg-white p-4">
      <div className="mb-5">
        <h1 className="mb-1 text-xl font-semibold">
          <Trans>Grow with Lens</Trans>
        </h1>
        <p className="text opacity-80">
          <Trans>
            You can set up a subscription fee for your channel and provide
            exclusive offers and perks to the subscribers, also people can pay
            and support your work.
          </Trans>
        </p>
      </div>
      {moduleLoading && (
        <div className="py-5">
          <Loader size="sm" />
        </div>
      )}

      {activeFollowModule?.amount && (
        <div className="mb-6 w-full rounded-xl border bg-gradient-to-r from-[#41AAD4]/20 to-[#41EAD4]/20 p-6 transition-all dark:border-gray-800">
          <div className="grid gap-y-4 md:grid-cols-3">
            <div>
              <span className="text-xs font-medium uppercase opacity-50">
                <Trans>Amount</Trans>
              </span>
              <h6 className="text-semibold text-xl">
                {activeFollowModule.amount?.value}{' '}
                {activeFollowModule.amount?.asset?.symbol}
              </h6>
            </div>
            <div>
              <span className="text-xs font-medium uppercase opacity-50">
                <Trans>Token</Trans>
              </span>
              <h6 className="text-semibold text-xl">
                {activeFollowModule.amount?.asset?.name}
              </h6>
            </div>
            <div>
              <span className="text-xs font-medium uppercase opacity-50">
                <Trans>Recipient</Trans>
              </span>
              <AddressExplorerLink address={activeFollowModule.recipient}>
                <span className="text-semibold block text-xl outline-none">
                  {shortenAddress(activeFollowModule.recipient)}
                </span>
              </AddressExplorerLink>
            </div>
          </div>
        </div>
      )}

      {showForm && !moduleLoading ? (
        <form onSubmit={handleSubmit(onSubmitForm)}>
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <div className="mb-1 flex items-center space-x-1.5">
                <div className="text-[11px] font-semibold uppercase opacity-70">
                  <Trans>Currency</Trans>
                </div>
              </div>
              <select
                autoComplete="off"
                className="w-full rounded-xl border border-gray-300 bg-white p-2.5 text-sm outline-none disabled:bg-gray-500 disabled:bg-opacity-20 disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900"
                value={watch('token')}
                onChange={(e) => setValue('token', e.target.value)}
              >
                {enabledCurrencies?.enabledModuleCurrencies?.map(
                  (currency: Erc20) => (
                    <option key={currency.address} value={currency.address}>
                      {currency.symbol}
                    </option>
                  )
                )}
              </select>
              {errors.token?.message && (
                <div className="mx-1 mt-1 text-xs font-medium text-red-500">
                  {errors.token?.message}
                </div>
              )}
            </div>
            <div>
              <Input
                label={t`Amount`}
                type="number"
                step="any"
                placeholder="10"
                autoComplete="off"
                validationError={errors.amount?.message}
                {...register('amount', { valueAsNumber: true })}
              />
            </div>
            <div>
              <Input
                label={t`Recipient`}
                placeholder="0x00..."
                autoComplete="off"
                validationError={errors.recipient?.message}
                {...register('recipient')}
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end space-x-2">
            {activeFollowModule && (
              <Button variant="hover" onClick={() => setShowForm(false)}>
                <Trans>Cancel</Trans>
              </Button>
            )}
            <Button loading={loading}>Set Membership</Button>
          </div>
        </form>
      ) : null}
      {!moduleLoading && !showForm && (
        <div className="flex items-center justify-end space-x-2">
          <Button onClick={() => setShowForm(true)}>
            <Trans>Update</Trans>
          </Button>
          <Button
            variant="danger"
            loading={loading}
            onClick={() => setMembership(true)}
          >
            <span className="text-white">
              <Trans>Disable</Trans>
            </span>
          </Button>
        </div>
      )}
    </div>
  )
}

export default Membership
