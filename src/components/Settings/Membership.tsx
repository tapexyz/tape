import { LENSHUB_PROXY_ABI } from '@abis/LensHubProxy'
import { useMutation, useQuery } from '@apollo/client'
import { AddressExplorerLink } from '@components/Common/ExplorerLink'
import { Button } from '@components/UIElements/Button'
import { Input } from '@components/UIElements/Input'
import { Loader } from '@components/UIElements/Loader'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  LENSHUB_PROXY_ADDRESS,
  RELAYER_ENABLED,
  WMATIC_TOKEN_ADDRESS
} from '@utils/constants'
import omitKey from '@utils/functions/omitKey'
import { shortenAddress } from '@utils/functions/shortenAddress'
import {
  BROADCAST_MUTATION,
  CHANNEL_FOLLOW_MODULE_QUERY,
  MODULES_CURRENCY_QUERY,
  SET_FOLLOW_MODULE_TYPED_DATA_MUTATION
} from '@utils/gql/queries'
import usePendingTxn from '@utils/hooks/usePendingTxn'
import clsx from 'clsx'
import { utils } from 'ethers'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import {
  CreateSetFollowModuleBroadcastItemResult,
  Erc20,
  FeeFollowModuleSettings,
  Profile
} from 'src/types'
import { useContractWrite, useSignTypedData } from 'wagmi'
import { z } from 'zod'

type Props = {
  channel: Profile
}

const formSchema = z.object({
  recipient: z.string().length(42, { message: 'Enter valid ethereum address' }),
  amount: z.string().min(1, { message: 'Enter valid amount' }),
  token: z.string().length(42, { message: 'Select valid token' })
})
type FormData = z.infer<typeof formSchema>

const Membership = ({ channel }: Props) => {
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
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

  const {
    data: followModuleData,
    refetch,
    loading: moduleLoading
  } = useQuery(CHANNEL_FOLLOW_MODULE_QUERY, {
    variables: { request: { profileIds: channel?.id } },
    skip: !channel?.id,
    onCompleted(data) {
      const activeFollowModule: FeeFollowModuleSettings =
        data?.profiles?.items[0]?.followModule
      setShowForm(activeFollowModule ? false : true)
    }
  })
  const activeFollowModule: FeeFollowModuleSettings =
    followModuleData?.profiles?.items[0]?.followModule

  const { signTypedDataAsync } = useSignTypedData({
    onError(error) {
      toast.error(error?.message)
      setLoading(false)
    }
  })
  const { data: enabledCurrencies } = useQuery(MODULES_CURRENCY_QUERY, {
    variables: { request: { profileIds: channel?.id } },
    skip: !channel?.id
  })

  const [broadcast, { data: broadcastData }] = useMutation(BROADCAST_MUTATION, {
    onError(error) {
      toast.error(error?.message)
      setLoading(false)
    }
  })

  const { data: writtenData, write: writeFollow } = useContractWrite({
    addressOrName: LENSHUB_PROXY_ADDRESS,
    contractInterface: LENSHUB_PROXY_ABI,
    functionName: 'setFollowModuleWithSig',
    onError(error: any) {
      setLoading(false)
      toast.error(error?.data?.message ?? error?.message)
    }
  })
  const { indexed } = usePendingTxn(
    writtenData?.hash || broadcastData?.broadcast?.txHash
  )
  useEffect(() => {
    if (indexed) {
      setLoading(false)
      toast.success('Membership updated')
      setShowForm(false)
      refetch({ request: { profileIds: channel?.id } })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indexed])

  const [setFollowModuleTypedData] = useMutation(
    SET_FOLLOW_MODULE_TYPED_DATA_MUTATION,
    {
      async onCompleted(data) {
        const { typedData, id } =
          data.createSetFollowModuleTypedData as CreateSetFollowModuleBroadcastItemResult
        const { profileId, followModule, followModuleInitData } =
          typedData?.value
        try {
          const signature = await signTypedDataAsync({
            domain: omitKey(typedData?.domain, '__typename'),
            types: omitKey(typedData?.types, '__typename'),
            value: omitKey(typedData?.value, '__typename')
          })
          const { v, r, s } = utils.splitSignature(signature)
          const args = {
            profileId,
            followModule,
            followModuleInitData,
            sig: { v, r, s, deadline: typedData.value.deadline }
          }
          if (RELAYER_ENABLED) {
            const { data } = await broadcast({
              variables: { request: { id, signature } }
            })
            if (data?.broadcast?.reason) writeFollow({ args })
          } else {
            writeFollow({ args })
          }
        } catch (error) {
          setLoading(false)
        }
      },
      onError(error) {
        setLoading(false)
        toast.error(error?.message)
      }
    }
  )

  const onSubmitForm = () => {
    setMembership(false)
  }

  const setMembership = (freeFollowModule: boolean) => {
    setLoading(true)
    setFollowModuleTypedData({
      variables: {
        request: {
          profileId: channel?.id,
          followModule: freeFollowModule
            ? { freeFollowModule: true }
            : {
                feeFollowModule: {
                  amount: {
                    currency: getValues('token'),
                    value: getValues('amount')
                  },
                  recipient: getValues('recipient')
                }
              }
        }
      }
    })
  }

  return (
    <div className="p-4 bg-white rounded-lg dark:bg-black">
      <div className="mb-5">
        <h1 className="mb-1 text-xl font-semibold">Grow with Lens</h1>
        <p className="text opacity-80">
          You can set up a subscription fee for your channel and provide
          exclusive offers and perks to the subscribers, also people can pay and
          support your work.
        </p>
      </div>
      {moduleLoading && (
        <div className="py-5">
          <Loader size="sm" />
        </div>
      )}

      {activeFollowModule?.amount && (
        <div className="p-6 mb-6 border transition-all w-full bg-gradient-to-r from-[#41AAD4]/20 to-[#41EAD4]/20 rounded-xl dark:border-gray-800">
          <div className="grid gap-y-4 md:grid-cols-3">
            <div>
              <span className="text-xs font-medium uppercase opacity-50">
                Amount
              </span>
              <h6 className="text-xl text-semibold">
                {activeFollowModule.amount?.value}{' '}
                {activeFollowModule.amount?.asset?.symbol}
              </h6>
            </div>
            <div>
              <span className="text-xs font-medium uppercase opacity-50">
                Token
              </span>
              <h6 className="text-xl text-semibold">
                {activeFollowModule.amount?.asset?.name}
              </h6>
            </div>
            <div>
              <span className="text-xs font-medium uppercase opacity-50">
                Recipient
              </span>
              <AddressExplorerLink address={activeFollowModule.recipient}>
                <span className="block text-xl outline-none text-semibold">
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
                value={watch('token')}
                onChange={(e) => setValue('token', e.target.value)}
              >
                {enabledCurrencies?.enabledModuleCurrencies?.map(
                  (currency: Erc20, idx: number) => (
                    <option key={idx} value={currency.address}>
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
                label="Amount"
                type="number"
                min={0}
                placeholder="10"
                autoComplete="off"
                {...register('amount')}
                validationError={errors.amount?.message}
              />
            </div>
            <div>
              <Input
                label="Recipient"
                placeholder="0x00..."
                autoComplete="off"
                validationError={errors.recipient?.message}
                {...register('recipient')}
              />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            {activeFollowModule && (
              <Button variant="secondary" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            )}
            <Button disabled={loading}>
              {loading ? 'Loading...' : 'Set Membership'}
            </Button>
          </div>
        </form>
      ) : null}
      {!moduleLoading && !showForm && (
        <div className="flex items-center justify-end space-x-2">
          <Button onClick={() => setShowForm(true)}>Update</Button>
          <Button
            variant="danger"
            disabled={loading}
            onClick={() => setMembership(true)}
          >
            <span className="text-white">
              {loading ? 'Disabling...' : 'Disable'}
            </span>
          </Button>
        </div>
      )}
    </div>
  )
}

export default Membership
