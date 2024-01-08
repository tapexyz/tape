import AddressExplorerLink from '@components/Common/Links/AddressExplorerLink'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDid } from '@hooks/useDid'
import useHandleWrongNetwork from '@hooks/useHandleWrongNetwork'
import usePendingTxn from '@hooks/usePendingTxn'
import useProfileStore from '@lib/store/idb/profile'
import useNonceStore from '@lib/store/nonce'
import { Button, Dialog, Flex } from '@radix-ui/themes'
import { LENSHUB_PROXY_ABI } from '@tape.xyz/abis'
import {
  ERROR_MESSAGE,
  INFINITE_SCROLL_ROOT_MARGIN,
  LENSHUB_PROXY_ADDRESS,
  REQUESTING_SIGNATURE_MESSAGE
} from '@tape.xyz/constants'
import {
  checkLensManagerPermissions,
  getSignature,
  shortenAddress
} from '@tape.xyz/generic'
import type { ProfileManagersRequest } from '@tape.xyz/lens'
import {
  ChangeProfileManagerActionType,
  useBroadcastOnchainMutation,
  useCreateChangeProfileManagersTypedDataMutation,
  useProfileManagersQuery
} from '@tape.xyz/lens'
import type { CustomErrorWithData } from '@tape.xyz/lens/custom-types'
import { ExternalOutline, Input, Loader } from '@tape.xyz/ui'
import React, { useEffect, useMemo, useState } from 'react'
import { useInView } from 'react-cool-inview'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { isAddress } from 'viem'
import { useContractWrite, useSignTypedData } from 'wagmi'
import { object, string, type z } from 'zod'

const formSchema = object({
  address: string().refine((addr) => isAddress(addr), {
    message: 'Invalid address'
  })
})
type FormData = z.infer<typeof formSchema>

const Entry = ({
  address,
  removingAddress,
  onRemove
}: {
  address: string
  removingAddress: string
  onRemove: (address: string) => void
}) => {
  const { did } = useDid({ address })
  return (
    <div
      key={address}
      className="tape-border rounded-small flex items-center justify-between px-4 py-3"
    >
      <div>
        <span className="font-bold">{did || shortenAddress(address)}</span>
        <AddressExplorerLink address={address}>
          <Flex align="center" gap="1">
            <span>{shortenAddress(address)}</span>
            <ExternalOutline className="size-3" />
          </Flex>
        </AddressExplorerLink>
      </div>
      <Button
        onClick={() => onRemove(address)}
        disabled={removingAddress === address}
        color="red"
        variant="surface"
        size="1"
      >
        Remove
      </Button>
    </div>
  )
}

const Managers = () => {
  const [submitting, setSubmitting] = useState(false)
  const [removingAddress, setRemovingAddress] = useState('')
  const [showModal, setShowModal] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(formSchema)
  })

  const { lensHubOnchainSigNonce, setLensHubOnchainSigNonce } = useNonceStore()
  const activeProfile = useProfileStore((state) => state.activeProfile)
  const handleWrongNetwork = useHandleWrongNetwork()
  const { canBroadcast } = checkLensManagerPermissions(activeProfile)

  const request: ProfileManagersRequest = { for: activeProfile?.id }
  const { data, refetch, error, loading, fetchMore } = useProfileManagersQuery({
    variables: { request },
    skip: !activeProfile?.id
  })
  const profileManagersWithoutLensManager = useMemo(() => {
    if (!data?.profileManagers?.items) {
      return []
    }
    return data.profileManagers.items.filter((m) => !m.isLensManager)
  }, [data?.profileManagers])

  const pageInfo = data?.profileManagers?.pageInfo

  const onError = (error: CustomErrorWithData) => {
    toast.error(error?.message ?? ERROR_MESSAGE)
    setSubmitting(false)
    setRemovingAddress('')
  }

  const onCompleted = (__typename?: 'RelayError' | 'RelaySuccess') => {
    if (__typename === 'RelayError') {
      return
    }

    reset()
    refetch()
    setRemovingAddress('')
    setShowModal(false)
    setSubmitting(false)
  }

  const { signTypedDataAsync } = useSignTypedData({
    onError
  })

  const { write, data: writeData } = useContractWrite({
    address: LENSHUB_PROXY_ADDRESS,
    abi: LENSHUB_PROXY_ABI,
    functionName: 'changeDelegatedExecutorsConfig',
    onSuccess: () => {
      setLensHubOnchainSigNonce(lensHubOnchainSigNonce + 1)
    },
    onError: (error) => {
      onError(error)
      setLensHubOnchainSigNonce(lensHubOnchainSigNonce - 1)
    }
  })

  const [broadcast, { data: broadcastData }] = useBroadcastOnchainMutation({
    onError,
    onCompleted: ({ broadcastOnchain }) =>
      onCompleted(broadcastOnchain.__typename)
  })

  const { indexed } = usePendingTxn({
    txHash: writeData?.hash,
    txId:
      broadcastData?.broadcastOnchain.__typename === 'RelaySuccess'
        ? broadcastData?.broadcastOnchain?.txId
        : undefined
  })

  useEffect(() => {
    if (indexed) {
      onCompleted()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indexed])

  const [toggleLensManager] = useCreateChangeProfileManagersTypedDataMutation({
    onCompleted: async ({ createChangeProfileManagersTypedData }) => {
      const { id, typedData } = createChangeProfileManagersTypedData
      const {
        delegatorProfileId,
        delegatedExecutors,
        approvals,
        configNumber,
        switchToGivenConfig
      } = typedData.value
      const args = [
        delegatorProfileId,
        delegatedExecutors,
        approvals,
        configNumber,
        switchToGivenConfig
      ]
      try {
        toast.loading(REQUESTING_SIGNATURE_MESSAGE)
        if (canBroadcast) {
          const signature = await signTypedDataAsync(getSignature(typedData))
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
        setSubmitting(false)
      }
    },
    onError
  })

  const addManager = async ({ address }: FormData) => {
    if (handleWrongNetwork()) {
      return
    }
    setSubmitting(true)
    return await toggleLensManager({
      variables: {
        options: { overrideSigNonce: lensHubOnchainSigNonce },
        request: {
          changeManagers: [
            {
              address,
              action: ChangeProfileManagerActionType.Add
            }
          ]
        }
      }
    })
  }

  const removeManager = async (address: string) => {
    if (handleWrongNetwork()) {
      return
    }
    setRemovingAddress(address)
    return await toggleLensManager({
      variables: {
        options: { overrideSigNonce: lensHubOnchainSigNonce },
        request: {
          changeManagers: [
            {
              address,
              action: ChangeProfileManagerActionType.Remove
            }
          ]
        }
      }
    })
  }

  const { observe } = useInView({
    threshold: 0.25,
    rootMargin: INFINITE_SCROLL_ROOT_MARGIN,
    onEnter: async () => {
      await fetchMore({
        variables: {
          request: {
            ...request,
            cursor: pageInfo?.next
          }
        }
      })
    }
  })

  return (
    <div>
      <div className="flex items-center justify-between space-x-2">
        <p>Accounts managing your profile.</p>
        <Dialog.Root open={showModal} onOpenChange={setShowModal}>
          <Dialog.Trigger>
            <Button highContrast variant="surface">
              New Manager
            </Button>
          </Dialog.Trigger>

          <Dialog.Content style={{ maxWidth: 550 }}>
            <Dialog.Title>New Manager</Dialog.Title>
            <Dialog.Description size="2" mb="4">
              This delegates permission to the address to perform all social
              operations on your behalf.
            </Dialog.Description>

            <form onSubmit={handleSubmit(addManager)}>
              <Input
                label="Address"
                placeholder="0x00..."
                error={errors.address?.message}
                {...register('address')}
              />
              <Flex gap="2" mt="4" justify="end">
                <Dialog.Close>
                  <Button
                    onClick={() => reset()}
                    type="button"
                    variant="soft"
                    color="gray"
                  >
                    Cancel
                  </Button>
                </Dialog.Close>
                <Button disabled={submitting} highContrast>
                  {submitting && <Loader size="sm" />}
                  Submit
                </Button>
              </Flex>
            </form>
          </Dialog.Content>
        </Dialog.Root>
      </div>
      <div className="mt-3">
        {loading && <Loader className="my-10" />}
        {(!loading && !profileManagersWithoutLensManager?.length) || error ? (
          <NoDataFound withImage isCenter />
        ) : null}
        {profileManagersWithoutLensManager?.length ? (
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {profileManagersWithoutLensManager?.map(({ address }) => (
              <Entry
                key={address}
                address={address}
                removingAddress={removingAddress}
                onRemove={(address) => removeManager(address)}
              />
            ))}
          </div>
        ) : null}
        {pageInfo?.next && (
          <span ref={observe} className="flex justify-center p-10">
            <Loader />
          </span>
        )}
      </div>
    </div>
  )
}

export default Managers
