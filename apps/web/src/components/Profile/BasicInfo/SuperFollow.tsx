import { LENSHUB_PROXY_ABI } from '@dragverse/abis'
import {
  ERROR_MESSAGE,
  LENSHUB_PROXY_ADDRESS,
  REQUESTING_SIGNATURE_MESSAGE,
  SIGN_IN_REQUIRED
} from '@dragverse/constants'
import {
  checkLensManagerPermissions,
  EVENTS,
  getProfile,
  getSignature,
  Tower
} from '@dragverse/generic'
import type { FeeFollowModuleSettings, Profile } from '@dragverse/lens'
import {
  FollowModuleType,
  useApprovedModuleAllowanceAmountQuery,
  useBroadcastOnchainMutation,
  useCreateFollowTypedDataMutation,
  useGenerateModuleCurrencyApprovalDataLazyQuery,
  useProfileFollowModuleQuery
} from '@dragverse/lens'
import type { CustomErrorWithData } from '@dragverse/lens/custom-types'
import { Loader } from '@dragverse/ui'
import useNonceStore from '@lib/store/nonce'
import useProfileStore from '@lib/store/profile'
import { Button, Dialog, Flex, Text } from '@radix-ui/themes'
import type { FC } from 'react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import {
  useContractWrite,
  useSendTransaction,
  useSignTypedData,
  useWaitForTransaction
} from 'wagmi'

type Props = {
  profile: Profile
  onJoin: () => void
  size?: '1' | '2' | '3'
  showText?: boolean
}

const SuperFollow: FC<Props> = ({ profile, onJoin, size = '2' }) => {
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
    address: LENSHUB_PROXY_ADDRESS,
    abi: LENSHUB_PROXY_ABI,
    functionName: 'follow',
    onSuccess: () => onCompleted(),
    onError
  })

  const [broadcast] = useBroadcastOnchainMutation({
    onCompleted: ({ broadcastOnchain }) =>
      onCompleted(broadcastOnchain.__typename),
    onError
  })

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
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Button
          onClick={() => setOpen(true)}
          highContrast
          size={size}
          disabled={loading}
        >
          {loading && <Loader size="sm" />}
          Subscribe
        </Button>
      </Dialog.Trigger>

      <Dialog.Content style={{ maxWidth: 450 }}>
        <Dialog.Title>Subscribe</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Support creator for their contributions on the platform.
        </Dialog.Description>

        <Flex gap="2" align="baseline">
          <Text as="div" size="4">
            Follow {getProfile(profile)?.displayName} for
          </Text>
          <Flex gap="1" align="center">
            <Text as="div" size="4">
              {followModule?.amount.value} {followModule?.amount.asset.symbol}
            </Text>
          </Flex>
        </Flex>

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </Dialog.Close>
          {isAllowed ? (
            <Button
              highContrast
              onClick={() => superFollow()}
              disabled={loading}
            >
              {loading && <Loader size="sm" />}
              Subscribe Now
            </Button>
          ) : (
            <Button highContrast onClick={() => allow()} disabled={loading}>
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
