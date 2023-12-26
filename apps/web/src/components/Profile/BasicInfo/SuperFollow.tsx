import type { FeeFollowModuleSettings, Profile } from '@tape.xyz/lens'
import type { CustomErrorWithData } from '@tape.xyz/lens/custom-types'
import type { FC } from 'react'

import useProfileStore from '@lib/store/idb/profile'
import useNonceStore from '@lib/store/nonce'
import { Button, Dialog, Flex, Text } from '@radix-ui/themes'
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
import {
  FollowModuleType,
  useApprovedModuleAllowanceAmountQuery,
  useBroadcastOnchainMutation,
  useCreateFollowTypedDataMutation,
  useGenerateModuleCurrencyApprovalDataLazyQuery,
  useProfileFollowModuleQuery
} from '@tape.xyz/lens'
import { Loader } from '@tape.xyz/ui'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import {
  useContractWrite,
  useSendTransaction,
  useSignTypedData,
  useWaitForTransaction
} from 'wagmi'

type Props = {
  onJoin: () => void
  profile: Profile
  showText?: boolean
  size?: '1' | '2' | '3'
}

const SuperFollow: FC<Props> = ({ onJoin, profile, size = '2' }) => {
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
    onError
  })

  const { write } = useContractWrite({
    abi: LENSHUB_PROXY_ABI,
    address: LENSHUB_PROXY_ADDRESS,
    functionName: 'follow',
    onError,
    onSuccess: () => onCompleted()
  })

  const [broadcast] = useBroadcastOnchainMutation({
    onCompleted: ({ broadcastOnchain }) =>
      onCompleted(broadcastOnchain.__typename),
    onError
  })

  const { data: followModuleData } = useProfileFollowModuleQuery({
    skip: !profile?.id,
    variables: { request: { forProfileId: profile?.id } }
  })

  const followModule = followModuleData?.profile
    ?.followModule as FeeFollowModuleSettings
  const amount = parseFloat(followModule?.amount?.value || '0')

  const { refetch } = useApprovedModuleAllowanceAmountQuery({
    onCompleted: ({ approvedModuleAllowanceAmount }) => {
      setIsAllowed(
        parseFloat(approvedModuleAllowanceAmount[0].allowance.value) > amount
      )
    },
    skip: !followModule?.amount?.asset?.contract.address || !activeProfile?.id,
    variables: {
      request: {
        currencies: followModule?.amount?.asset?.contract.address,
        followModules: [FollowModuleType.FeeFollowModule],
        openActionModules: [],
        referenceModules: []
      }
    }
  })

  const { data: txData, sendTransaction } = useSendTransaction({
    onError(error: CustomErrorWithData) {
      toast.error(error?.data?.message ?? error?.message)
    }
  })

  useWaitForTransaction({
    hash: txData?.hash,
    onSuccess: () => refetch()
  })

  const [createFollowTypedData] = useCreateFollowTypedDataMutation({
    async onCompleted({ createFollowTypedData }) {
      const { id, typedData } = createFollowTypedData
      const {
        datas,
        followerProfileId,
        followTokenIds,
        idsOfProfilesToFollow
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
            return write({ args })
          }
          return
        }
        return write({ args })
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
      data: generated?.data,
      to: generated?.to
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
              followModule: {
                feeFollowModule: {
                  amount: {
                    currency: followModule?.amount.asset.contract.address,
                    value: followModule?.amount.value
                  }
                }
              },
              profileId: profile?.id
            }
          ]
        }
      }
    })
  }

  return (
    <Dialog.Root onOpenChange={setOpen} open={open}>
      <Dialog.Trigger>
        <Button
          disabled={loading}
          highContrast
          onClick={() => setOpen(true)}
          size={size}
        >
          {loading && <Loader size="sm" />}
          Subscribe
        </Button>
      </Dialog.Trigger>

      <Dialog.Content style={{ maxWidth: 450 }}>
        <Dialog.Title>Subscribe</Dialog.Title>
        <Dialog.Description mb="4" size="2">
          Support creator for their contributions on the platform.
        </Dialog.Description>

        <Flex align="baseline" gap="2">
          <Text as="div" size="4">
            Follow {getProfile(profile)?.displayName} for
          </Text>
          <Flex align="center" gap="1">
            <Text as="div" size="4">
              {followModule?.amount.value} {followModule?.amount.asset.symbol}
            </Text>
          </Flex>
        </Flex>

        <Flex gap="3" justify="end" mt="4">
          <Dialog.Close>
            <Button color="gray" variant="soft">
              Cancel
            </Button>
          </Dialog.Close>
          {isAllowed ? (
            <Button
              disabled={loading}
              highContrast
              onClick={() => superFollow()}
            >
              {loading && <Loader size="sm" />}
              Subscribe Now
            </Button>
          ) : (
            <Button disabled={loading} highContrast onClick={() => allow()}>
              {loading && <Loader size="sm" />}
              Allow
            </Button>
          )}
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  )
}

export default SuperFollow
