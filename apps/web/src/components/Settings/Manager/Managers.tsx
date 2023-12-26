import type { ProfileManagersRequest } from '@tape.xyz/lens'
import type { CustomErrorWithData } from '@tape.xyz/lens/custom-types'

import ExternalOutline from '@components/Common/Icons/ExternalOutline'
import AddressExplorerLink from '@components/Common/Links/AddressExplorerLink'
import { Input } from '@components/UIElements/Input'
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
import {
  ChangeProfileManagerActionType,
  useBroadcastOnchainMutation,
  useCreateChangeProfileManagersTypedDataMutation,
  useProfileManagersQuery
} from '@tape.xyz/lens'
import { Loader } from '@tape.xyz/ui'
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
  onRemove,
  removingAddress
}: {
  address: string
  onRemove: (address: string) => void
  removingAddress: string
}) => {
  const { did } = useDid({ address })
  return (
    <div
      className="tape-border rounded-small flex items-center justify-between px-4 py-3"
      key={address}
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
        color="red"
        disabled={removingAddress === address}
        onClick={() => onRemove(address)}
        size="1"
        variant="surface"
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
    formState: { errors },
    handleSubmit,
    register,
    reset
  } = useForm<FormData>({
    resolver: zodResolver(formSchema)
  })

  const { lensHubOnchainSigNonce, setLensHubOnchainSigNonce } = useNonceStore()
  const activeProfile = useProfileStore((state) => state.activeProfile)
  const handleWrongNetwork = useHandleWrongNetwork()
  const { canBroadcast } = checkLensManagerPermissions(activeProfile)

  const request: ProfileManagersRequest = { for: activeProfile?.id }
  const { data, error, fetchMore, loading, refetch } = useProfileManagersQuery({
    skip: !activeProfile?.id,
    variables: { request }
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

  const { data: writeData, write } = useContractWrite({
    abi: LENSHUB_PROXY_ABI,
    address: LENSHUB_PROXY_ADDRESS,
    functionName: 'changeDelegatedExecutorsConfig',
    onError: (error) => {
      onError(error)
      setLensHubOnchainSigNonce(lensHubOnchainSigNonce - 1)
    },
    onSuccess: () => {
      setLensHubOnchainSigNonce(lensHubOnchainSigNonce + 1)
    }
  })

  const [broadcast, { data: broadcastData }] = useBroadcastOnchainMutation({
    onCompleted: ({ broadcastOnchain }) =>
      onCompleted(broadcastOnchain.__typename),
    onError
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
        approvals,
        configNumber,
        delegatedExecutors,
        delegatorProfileId,
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
              action: ChangeProfileManagerActionType.Add,
              address
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
              action: ChangeProfileManagerActionType.Remove,
              address
            }
          ]
        }
      }
    })
  }

  const { observe } = useInView({
    onEnter: async () => {
      await fetchMore({
        variables: {
          request: {
            ...request,
            cursor: pageInfo?.next
          }
        }
      })
    },
    rootMargin: INFINITE_SCROLL_ROOT_MARGIN,
    threshold: 0.25
  })

  return (
    <div>
      <div className="flex items-center justify-between space-x-2">
        <p>Accounts managing your profile.</p>
        <Dialog.Root onOpenChange={setShowModal} open={showModal}>
          <Dialog.Trigger>
            <Button highContrast variant="surface">
              New Manager
            </Button>
          </Dialog.Trigger>

          <Dialog.Content style={{ maxWidth: 550 }}>
            <Dialog.Title>New Manager</Dialog.Title>
            <Dialog.Description mb="4" size="2">
              This delegates permission to the address to perform all social
              operations on your behalf.
            </Dialog.Description>

            <form onSubmit={handleSubmit(addManager)}>
              <Input
                label="Address"
                placeholder="0x00..."
                validationError={errors.address?.message}
                {...register('address')}
              />
              <Flex gap="2" justify="end" mt="4">
                <Dialog.Close>
                  <Button
                    color="gray"
                    onClick={() => reset()}
                    type="button"
                    variant="soft"
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
          <NoDataFound isCenter withImage />
        ) : null}
        {profileManagersWithoutLensManager?.length ? (
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {profileManagersWithoutLensManager?.map(({ address }) => (
              <Entry
                address={address}
                key={address}
                onRemove={(address) => removeManager(address)}
                removingAddress={removingAddress}
              />
            ))}
          </div>
        ) : null}
        {pageInfo?.next && (
          <span className="flex justify-center p-10" ref={observe}>
            <Loader />
          </span>
        )}
      </div>
    </div>
  )
}

export default Managers
