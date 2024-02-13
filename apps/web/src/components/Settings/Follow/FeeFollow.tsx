import { zodResolver } from '@hookform/resolvers/zod'
import useHandleWrongNetwork from '@hooks/useHandleWrongNetwork'
import usePendingTxn from '@hooks/usePendingTxn'
import useProfileStore from '@lib/store/idb/profile'
import useAllowedTokensStore from '@lib/store/idb/tokens'
import useNonceStore from '@lib/store/nonce'
import { LENSHUB_PROXY_ABI } from '@tape.xyz/abis'
import { useCopyToClipboard } from '@tape.xyz/browser'
import {
  ERROR_MESSAGE,
  LENSHUB_PROXY_ADDRESS,
  REQUESTING_SIGNATURE_MESSAGE,
  WMATIC_TOKEN_ADDRESS
} from '@tape.xyz/constants'
import {
  checkLensManagerPermissions,
  getProfile,
  getSignature,
  shortenAddress
} from '@tape.xyz/generic'
import type {
  CreateSetFollowModuleBroadcastItemResult,
  FeeFollowModuleSettings,
  Profile
} from '@tape.xyz/lens'
import {
  useBroadcastOnchainMutation,
  useCreateSetFollowModuleTypedDataMutation,
  useProfileFollowModuleQuery
} from '@tape.xyz/lens'
import type { CustomErrorWithData } from '@tape.xyz/lens/custom-types'
import {
  Button,
  Input,
  Select,
  SelectItem,
  Spinner,
  Tooltip
} from '@tape.xyz/ui'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useSignTypedData, useWriteContract } from 'wagmi'
import type { z } from 'zod'
import { number, object, string } from 'zod'

type Props = {
  profile: Profile
}

const formSchema = object({
  recipient: string().length(42, { message: 'Enter valid ethereum address' }),
  amount: number()
    .nonnegative({ message: 'Amount should to greater than zero' })
    .refine((n) => n > 0, { message: 'Amount should be greater than 0' }),
  token: string().length(42, { message: 'Select valid token' })
})
type FormData = z.infer<typeof formSchema>

const FeeFollow = ({ profile }: Props) => {
  const [copy] = useCopyToClipboard()

  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const { lensHubOnchainSigNonce, setLensHubOnchainSigNonce } = useNonceStore()
  const allowedTokens = useAllowedTokensStore((state) => state.allowedTokens)
  const handleWrongNetwork = useHandleWrongNetwork()
  const { activeProfile } = useProfileStore()
  const { canBroadcast } = checkLensManagerPermissions(activeProfile)

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
      recipient: getProfile(profile).address,
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
    variables: { request: { forProfileId: profile?.id } },
    skip: !profile?.id,
    notifyOnNetworkStatusChange: true,
    onCompleted: ({ profile }) => {
      const activeFollowModule =
        profile?.followModule as FeeFollowModuleSettings
      setShowForm(activeFollowModule ? false : true)
    }
  })
  const activeFollowModule = followModuleData?.profile
    ?.followModule as FeeFollowModuleSettings

  const { signTypedDataAsync } = useSignTypedData({
    mutation: { onError }
  })

  const [broadcast, { data: broadcastData }] = useBroadcastOnchainMutation({
    onError
  })

  const { data: txHash, writeContractAsync } = useWriteContract({
    mutation: {
      onError
    }
  })

  const write = async ({ args }: { args: any[] }) => {
    return await writeContractAsync({
      address: LENSHUB_PROXY_ADDRESS,
      abi: LENSHUB_PROXY_ABI,
      functionName: 'setFollowModule',
      args
    })
  }

  const { indexed } = usePendingTxn({
    txHash,
    txId:
      broadcastData?.broadcastOnchain.__typename === 'RelaySuccess'
        ? broadcastData?.broadcastOnchain?.txId
        : undefined
  })

  useEffect(() => {
    if (indexed) {
      setLoading(false)
      refetch()
      toast.success('Follow settings updated')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indexed])

  const [createSetFollowModuleTypedData] =
    useCreateSetFollowModuleTypedDataMutation({
      onCompleted: async ({ createSetFollowModuleTypedData }) => {
        const { typedData, id } =
          createSetFollowModuleTypedData as CreateSetFollowModuleBroadcastItemResult
        const { profileId, followModule, followModuleInitData } =
          typedData.value
        const args = [profileId, followModule, followModuleInitData]
        try {
          toast.loading(REQUESTING_SIGNATURE_MESSAGE)
          if (canBroadcast) {
            const signature = await signTypedDataAsync(getSignature(typedData))
            setLensHubOnchainSigNonce(lensHubOnchainSigNonce + 1)
            const { data } = await broadcast({
              variables: { request: { id, signature } }
            })
            if (data?.broadcastOnchain?.__typename === 'RelayError') {
              return await write({ args })
            }
            return
          }
          return await write({ args })
        } catch {
          setLoading(false)
        }
      },
      onError
    })

  const updateFeeFollow = async (disable: boolean) => {
    await handleWrongNetwork()

    setLoading(true)
    return await createSetFollowModuleTypedData({
      variables: {
        options: { overrideSigNonce: lensHubOnchainSigNonce },
        request: {
          followModule: disable
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
    updateFeeFollow(false)
  }

  return (
    <>
      <div className="mb-5 space-y-2">
        <h1 className="text-brand-400 text-xl font-bold">Grow with Lens</h1>
        <p className="text opacity-80">
          You can set up a follow fee for your profile and provide exclusive
          offers and perks to the followers, also people can pay and support
          your work.
        </p>
      </div>
      {moduleLoading && (
        <div className="py-5">
          <Spinner size="sm" />
        </div>
      )}

      {activeFollowModule?.amount && (
        <div className="tape-border mb-6 w-full rounded-xl bg-gradient-to-br p-6 transition-all">
          <div className="grid gap-y-4 md:grid-cols-3">
            <div>
              <span>Amount</span>
              <h6 className="text-xl font-bold">
                {activeFollowModule.amount?.value}{' '}
                {activeFollowModule.amount?.asset?.symbol}
              </h6>
            </div>
            <div>
              <span>Asset</span>
              <h6 className="text-xl font-bold">
                {activeFollowModule.amount?.asset?.name}
              </h6>
            </div>
            <div>
              <span>Recipient</span>
              <Tooltip content="Copy Address" placement="top">
                <Button onClick={() => copy(activeFollowModule.recipient)}>
                  <span className="block text-xl font-bold outline-none">
                    {shortenAddress(activeFollowModule.recipient, 6)}
                  </span>
                </Button>
              </Tooltip>
            </div>
          </div>
        </div>
      )}

      {showForm && !moduleLoading ? (
        <form onSubmit={handleSubmit(onSubmitForm)}>
          <div className="laptop:w-1/2 flex flex-col gap-4">
            <div>
              <div className="mb-1 text-sm font-medium">Currency</div>
              <Select
                value={watch('token')}
                onValueChange={(value) => setValue('token', value)}
              >
                {allowedTokens?.map(({ address, name }) => (
                  <SelectItem key={address} value={address}>
                    {name}
                  </SelectItem>
                ))}
              </Select>
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
                step="any"
                placeholder="10"
                autoComplete="off"
                error={errors.amount?.message}
                {...register('amount', { valueAsNumber: true })}
              />
            </div>
            <div>
              <Input
                label="Recipient"
                placeholder="0x00..."
                autoComplete="off"
                error={errors.recipient?.message}
                {...register('recipient')}
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-2">
            {activeFollowModule && (
              <Button variant="secondary" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            )}
            <Button loading={loading} disabled={loading}>
              Set Membership
            </Button>
          </div>
        </form>
      ) : null}
      {!moduleLoading && !showForm && (
        <div className="flex items-center justify-end space-x-2">
          <Button
            variant="danger"
            disabled={loading}
            loading={loading}
            onClick={() => updateFeeFollow(true)}
          >
            Disable
          </Button>
          <Button onClick={() => setShowForm(true)}>Update</Button>
        </div>
      )}
    </>
  )
}

export default FeeFollow
