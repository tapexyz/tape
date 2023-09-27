import { LENSHUB_PROXY_ABI } from '@abis/LensHubProxy'
import { Input } from '@components/UIElements/Input'
import Tooltip from '@components/UIElements/Tooltip'
import { zodResolver } from '@hookform/resolvers/zod'
import usePendingTxn from '@hooks/usePendingTxn'
import { useCopyToClipboard } from '@lenstube/browser'
import {
  ERROR_MESSAGE,
  LENSHUB_PROXY_ADDRESS,
  REQUESTING_SIGNATURE_MESSAGE,
  WMATIC_TOKEN_ADDRESS
} from '@lenstube/constants'
import { getSignature, shortenAddress } from '@lenstube/generic'
import type {
  CreateSetFollowModuleBroadcastItemResult,
  FeeFollowModuleSettings,
  Profile
} from '@lenstube/lens'
import {
  LimitType,
  useBroadcastOnchainMutation,
  useCreateSetFollowModuleTypedDataMutation,
  useEnabledCurrenciesQuery,
  useProfileFollowModuleQuery
} from '@lenstube/lens'
import type { CustomErrorWithData } from '@lenstube/lens/custom-types'
import { Loader } from '@lenstube/ui'
import useChannelStore from '@lib/store/channel'
import { t, Trans } from '@lingui/macro'
import { Button, Card, Flex, Select, Text } from '@radix-ui/themes'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { formatUnits } from 'viem'
import { useContractWrite, useSignTypedData } from 'wagmi'
import type { z } from 'zod'
import { number, object, string } from 'zod'

type Props = {
  channel: Profile
}

const formSchema = object({
  recipient: string().length(42, { message: 'Enter valid ethereum address' }),
  amount: number()
    .nonnegative({ message: 'Amount should to greater than zero' })
    .refine((n) => n > 0, { message: 'Amount should be greater than 0' }),
  token: string().length(42, { message: 'Select valid token' })
})
type FormData = z.infer<typeof formSchema>

const Membership = ({ channel }: Props) => {
  const [copy] = useCopyToClipboard()

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
      recipient: channel.ownedBy.address,
      amount: 2,
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
    variables: { request: { forProfileId: channel?.id } },
    skip: !channel?.id,
    onCompleted: ({ profile }) => {
      const activeFollowModule =
        profile?.followModule as FeeFollowModuleSettings
      setShowForm(activeFollowModule ? false : true)
    }
  })
  const activeFollowModule = followModuleData?.profile
    ?.followModule as FeeFollowModuleSettings

  const { signTypedDataAsync } = useSignTypedData({
    onError
  })
  const { data: enabledCurrencies } = useEnabledCurrenciesQuery({
    variables: {
      request: {
        limit: LimitType.Fifty
      }
    },
    skip: !channel?.id
  })

  const [broadcast, { data: broadcastData }] = useBroadcastOnchainMutation({
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
      broadcastData?.broadcastOnchain.__typename === 'RelaySuccess'
        ? broadcastData?.broadcastOnchain?.txId
        : undefined
  })

  useEffect(() => {
    if (indexed) {
      setLoading(false)
      toast.success(t`Membership updated`)
      setShowForm(false)
      refetch({ request: { forProfileId: channel?.id } })
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
          if (data?.broadcastOnchain?.__typename === 'RelayError') {
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
    <Card size="3">
      <div className="mb-5">
        <Text size="5" weight="bold">
          <Trans>Grow with Lens</Trans>
        </Text>
        <p className="text opacity-80">
          <Trans>
            You can set up a follow fee for your profile and provide exclusive
            offers and perks to the followers, also people can pay and support
            your work.
          </Trans>
        </p>
      </div>
      {moduleLoading && (
        <div className="py-5">
          <Loader size="sm" />
        </div>
      )}

      {activeFollowModule?.amount && (
        <Card className="mb-6 w-full rounded-xl border bg-gradient-to-r from-[#41AAD4]/20 to-[#41EAD4]/20 p-6 transition-all dark:border-gray-800">
          <div className="grid gap-y-4 md:grid-cols-3">
            <div>
              <span className="text-xs font-medium uppercase opacity-50">
                <Trans>Amount</Trans>
              </span>
              <h6 className="text-xl font-bold">
                {formatUnits(
                  BigInt(activeFollowModule.amount?.value),
                  activeFollowModule.amount?.asset.decimals
                )}{' '}
                {activeFollowModule.amount?.asset?.symbol}
              </h6>
            </div>
            <div>
              <span className="text-xs font-medium uppercase opacity-50">
                <Trans>Token</Trans>
              </span>
              <h6 className="text-xl font-bold">
                {activeFollowModule.amount?.asset?.name}
              </h6>
            </div>
            <div>
              <div className="mb-1 text-xs font-medium uppercase opacity-50">
                <Trans>Recipient</Trans>
              </div>
              <Tooltip content="Copy Address" placement="top">
                <Button
                  variant="ghost"
                  onClick={() => copy(activeFollowModule.recipient)}
                >
                  <span className="block text-xl font-bold outline-none">
                    {shortenAddress(activeFollowModule.recipient)}
                  </span>
                </Button>
              </Tooltip>
            </div>
          </div>
        </Card>
      )}

      {showForm && !moduleLoading ? (
        <form onSubmit={handleSubmit(onSubmitForm)}>
          <Flex direction="column" className="w-1/2" gap="4">
            <div>
              <Text as="div" size="2" mb="1">
                Currency
              </Text>
              <Select.Root
                value={watch('token')}
                onValueChange={(value) => setValue('token', value)}
              >
                <Select.Trigger
                  className="w-full"
                  placeholder="Select preferred currency"
                />
                <Select.Content variant="soft">
                  {enabledCurrencies?.currencies.items?.map(
                    ({ contract, name }) => (
                      <Select.Item
                        key={contract.address}
                        value={contract.address}
                      >
                        {name}
                      </Select.Item>
                    )
                  )}
                </Select.Content>
              </Select.Root>
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
          </Flex>
          <div className="mt-6 flex justify-end space-x-2">
            {activeFollowModule && (
              <Button variant="soft" onClick={() => setShowForm(false)}>
                <Trans>Cancel</Trans>
              </Button>
            )}
            <Button highContrast disabled={loading}>
              Set Membership
            </Button>
          </div>
        </form>
      ) : null}
      {!moduleLoading && !showForm && (
        <div className="flex items-center justify-end space-x-2">
          <Button
            color="red"
            disabled={loading}
            onClick={() => setMembership(true)}
          >
            <span className="text-white">
              <Trans>Disable</Trans>
            </span>
          </Button>
          <Button highContrast onClick={() => setShowForm(true)}>
            <Trans>Update</Trans>
          </Button>
        </div>
      )}
    </Card>
  )
}

export default Membership
