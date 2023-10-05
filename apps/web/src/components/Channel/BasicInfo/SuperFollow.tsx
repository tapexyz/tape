import { LENSHUB_PROXY_ABI } from '@lenstube/abis'
import { Analytics, TRACK } from '@lenstube/browser'
import {
  ERROR_MESSAGE,
  LENSHUB_PROXY_ADDRESS,
  REQUESTING_SIGNATURE_MESSAGE
} from '@lenstube/constants'
import { getSignature, trimLensHandle } from '@lenstube/generic'
import type { FeeFollowModuleSettings, Profile } from '@lenstube/lens'
import {
  FollowModuleType,
  useApprovedModuleAllowanceAmountQuery,
  useBroadcastOnchainMutation,
  useCreateFollowTypedDataMutation,
  useGenerateModuleCurrencyApprovalDataLazyQuery,
  useProfileFollowModuleQuery
} from '@lenstube/lens'
import type { CustomErrorWithData } from '@lenstube/lens/custom-types'
import useAuthPersistStore from '@lib/store/auth'
import useChannelStore from '@lib/store/channel'
import { Trans } from '@lingui/macro'
import { Button, Dialog, Flex, Text } from '@radix-ui/themes'
import type { FC } from 'react'
import React, { useState } from 'react'
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
  const [loading, setLoading] = useState(false)
  const [isAllowed, setIsAllowed] = useState(false)
  const [open, setOpen] = useState(false)

  const selectedSimpleProfile = useAuthPersistStore(
    (state) => state.selectedSimpleProfile
  )
  const userSigNonce = useChannelStore((state) => state.userSigNonce)
  const setUserSigNonce = useChannelStore((state) => state.setUserSigNonce)

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
    toast.success(`Followed ${profile.handle}`)
    setLoading(false)
    Analytics.track(TRACK.CHANNEL.JOIN, {
      channel_id: profile.id,
      channel_name: profile.handle
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

  const { refetch } = useApprovedModuleAllowanceAmountQuery({
    variables: {
      request: {
        currencies: followModule?.amount?.asset?.contract.address,
        followModules: [FollowModuleType.FeeFollowModule],
        openActionModules: [],
        referenceModules: []
      }
    },
    skip:
      !followModule?.amount?.asset?.contract.address ||
      !selectedSimpleProfile?.id,
    onCompleted: ({ approvedModuleAllowanceAmount }) => {
      setIsAllowed(approvedModuleAllowanceAmount[0].allowance.value !== '0x00')
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
      try {
        toast.loading(REQUESTING_SIGNATURE_MESSAGE)
        const signature = await signTypedDataAsync(getSignature(typedData))
        setUserSigNonce(userSigNonce + 1)
        const { data } = await broadcast({
          variables: { request: { id, signature } }
        })
        if (data?.broadcastOnchain.__typename === 'RelayError') {
          const {
            followerProfileId,
            idsOfProfilesToFollow,
            followTokenIds,
            datas
          } = typedData.value
          return write?.({
            args: [
              followerProfileId,
              idsOfProfilesToFollow,
              followTokenIds,
              datas
            ]
          })
        }
      } catch {
        setLoading(false)
      }
    },
    onError
  })

  const [generateAllowanceQuery] =
    useGenerateModuleCurrencyApprovalDataLazyQuery()

  const allow = async () => {
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
    if (!selectedSimpleProfile?.id) {
      return toast.error('Sign in to proceed')
    }
    if (!isAllowed) {
      return toast.error(
        `Goto Settings -> Permissions and allow fee follow module for ${followModule?.amount?.asset?.symbol}.`
      )
    }
    setLoading(true)
    await createFollowTypedData({
      variables: {
        options: { overrideSigNonce: userSigNonce },
        request: {
          follow: [
            {
              profileId: profile?.id,
              followModule: {
                feeFollowModule: true
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
          variant="classic"
          size={size}
          disabled={loading}
        >
          <Trans>Super Follow</Trans>
        </Button>
      </Dialog.Trigger>

      <Dialog.Content style={{ maxWidth: 450 }}>
        <Dialog.Title>Super Follow</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Support creator for their contributions on the platform.
        </Dialog.Description>

        <Flex gap="2" align="baseline">
          <Text as="div" size="4">
            Follow {trimLensHandle(profile.handle)} for
          </Text>
          <Flex gap="1" align="center">
            <Text as="div" size="6">
              $
            </Text>
            <Text as="div" size="7" weight="bold">
              {followModule?.amount.rate?.value}
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
              variant="classic"
              disabled={loading}
            >
              <Trans>Super Follow</Trans>
            </Button>
          ) : (
            <Button
              highContrast
              variant="classic"
              onClick={() => allow()}
              disabled={loading}
            >
              <Trans>Allow</Trans>
            </Button>
          )}
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  )
}

export default SuperFollow
