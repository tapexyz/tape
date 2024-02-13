import useProfileStore from '@lib/store/idb/profile'
import useNonceStore from '@lib/store/nonce'
import { LENSHUB_PROXY_ABI } from '@tape.xyz/abis'
import {
  ERROR_MESSAGE,
  LENSHUB_PROXY_ADDRESS,
  REQUESTING_SIGNATURE_MESSAGE,
  SIGN_IN_REQUIRED
} from '@tape.xyz/constants'
import {
  checkLensManagerPermissions,
  EVENTS,
  getProfile,
  getSignature,
  Tower
} from '@tape.xyz/generic'
import type { FeeFollowModuleSettings, Profile } from '@tape.xyz/lens'
import {
  FollowModuleType,
  useApprovedModuleAllowanceAmountQuery,
  useBroadcastOnchainMutation,
  useCreateFollowTypedDataMutation,
  useGenerateModuleCurrencyApprovalDataLazyQuery,
  useProfileFollowModuleQuery
} from '@tape.xyz/lens'
import type { CustomErrorWithData } from '@tape.xyz/lens/custom-types'
import { Button, Modal } from '@tape.xyz/ui'
import type { FC } from 'react'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import {
  useSendTransaction,
  useSignTypedData,
  useWaitForTransactionReceipt,
  useWriteContract
} from 'wagmi'

type Props = {
  profile: Profile
  onJoin: () => void
  showText?: boolean
}

const SuperFollow: FC<Props> = ({ profile, onJoin }) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isAllowed, setIsAllowed] = useState(false)

  const { activeProfile } = useProfileStore()
  const { lensHubOnchainSigNonce, setLensHubOnchainSigNonce } = useNonceStore()
  const { canBroadcast } = checkLensManagerPermissions(activeProfile)

  const onError = (error: CustomErrorWithData) => {
    toast.error(error?.data?.message ?? error?.message ?? ERROR_MESSAGE)
    setLoading(false)
  }

  const onCompleted = (__typename?: 'RelayError' | 'RelaySuccess') => {
    if (__typename === 'RelayError') {
      return
    }
    onJoin()
    setOpen(false)
    toast.success(`Followed ${getProfile(profile)?.displayName}`)
    setLoading(false)
    Tower.track(EVENTS.PROFILE.SUPER_FOLLOW, {
      profile_id: profile.id,
      profile_name: getProfile(profile)?.slug
    })
  }

  const { signTypedDataAsync } = useSignTypedData({
    mutation: { onError }
  })

  const { writeContractAsync } = useWriteContract({
    mutation: {
      onSuccess: () => onCompleted(),
      onError
    }
  })

  const [broadcast] = useBroadcastOnchainMutation({
    onCompleted: ({ broadcastOnchain }) =>
      onCompleted(broadcastOnchain.__typename),
    onError
  })

  const write = async ({ args }: { args: any[] }) => {
    return await writeContractAsync({
      address: LENSHUB_PROXY_ADDRESS,
      abi: LENSHUB_PROXY_ABI,
      functionName: 'follow',
      args
    })
  }

  const { data: followModuleData } = useProfileFollowModuleQuery({
    variables: { request: { forProfileId: profile?.id } },
    skip: !profile?.id
  })

  const followModule = followModuleData?.profile
    ?.followModule as FeeFollowModuleSettings
  const amount = parseFloat(followModule?.amount?.value || '0')

  const { refetch } = useApprovedModuleAllowanceAmountQuery({
    variables: {
      request: {
        currencies: followModule?.amount?.asset?.contract.address,
        followModules: [FollowModuleType.FeeFollowModule],
        openActionModules: [],
        referenceModules: []
      }
    },
    skip: !followModule?.amount?.asset?.contract.address || !activeProfile?.id,
    onCompleted: ({ approvedModuleAllowanceAmount }) => {
      setIsAllowed(
        parseFloat(approvedModuleAllowanceAmount[0].allowance.value) > amount
      )
    }
  })

  const { data: txnHash, sendTransaction } = useSendTransaction({
    mutation: {
      onError: (error: CustomErrorWithData) => {
        toast.error(error?.data?.message ?? error?.message)
      }
    }
  })

  const { isSuccess } = useWaitForTransactionReceipt({
    hash: txnHash
  })

  useEffect(() => {
    if (isSuccess) {
      refetch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess])

  const [createFollowTypedData] = useCreateFollowTypedDataMutation({
    async onCompleted({ createFollowTypedData }) {
      const { typedData, id } = createFollowTypedData
      const {
        followerProfileId,
        idsOfProfilesToFollow,
        followTokenIds,
        datas
      } = typedData.value
      const args = [
        followerProfileId,
        idsOfProfilesToFollow,
        followTokenIds,
        datas
      ]
      try {
        toast.loading(REQUESTING_SIGNATURE_MESSAGE)
        if (canBroadcast) {
          const signature = await signTypedDataAsync(getSignature(typedData))
          setLensHubOnchainSigNonce(lensHubOnchainSigNonce + 1)
          const { data } = await broadcast({
            variables: { request: { id, signature } }
          })
          if (data?.broadcastOnchain.__typename === 'RelayError') {
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

  const [generateAllowanceQuery] =
    useGenerateModuleCurrencyApprovalDataLazyQuery()

  const allow = async () => {
    setLoading(true)
    const { data: allowanceData } = await generateAllowanceQuery({
      variables: {
        request: {
          allowance: {
            currency: followModule?.amount.asset.contract.address,
            value: Number.MAX_SAFE_INTEGER.toString()
          },
          module: {
            followModule: FollowModuleType.FeeFollowModule
          }
        }
      }
    })
    const generated = allowanceData?.generateModuleCurrencyApprovalData
    sendTransaction?.({
      to: generated?.to,
      data: generated?.data
    })
  }

  const superFollow = async () => {
    if (!activeProfile?.id) {
      return toast.error(SIGN_IN_REQUIRED)
    }
    if (!isAllowed) {
      return toast.error(
        `Goto Settings -> Allowance and allow fee follow module for ${followModule?.amount?.asset?.symbol}.`
      )
    }
    setLoading(true)
    return await createFollowTypedData({
      variables: {
        options: { overrideSigNonce: lensHubOnchainSigNonce },
        request: {
          follow: [
            {
              profileId: profile?.id,
              followModule: {
                feeFollowModule: {
                  amount: {
                    currency: followModule?.amount.asset.contract.address,
                    value: followModule?.amount.value
                  }
                }
              }
            }
          ]
        }
      }
    })
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} disabled={loading}>
        Subscribe
      </Button>
      <Modal
        size="sm"
        title="Subscribe"
        description="Support creator for their contributions on the platform."
        show={open}
        setShow={setOpen}
      >
        <div className="flex items-baseline gap-2">
          <div className="text-lg">
            Follow {getProfile(profile)?.displayName} for
          </div>
          <div className="flex items-center gap-1">
            <div className="text-lg">
              {followModule?.amount.value} {followModule?.amount.asset.symbol}
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          {isAllowed ? (
            <Button
              onClick={() => superFollow()}
              loading={loading}
              disabled={loading}
            >
              Subscribe Now
            </Button>
          ) : (
            <Button
              loading={loading}
              onClick={() => allow()}
              disabled={loading}
            >
              Allow
            </Button>
          )}
        </div>
      </Modal>
    </>
  )
}

export default SuperFollow
