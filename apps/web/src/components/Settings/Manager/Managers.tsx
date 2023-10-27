import ExternalOutline from '@components/Common/Icons/ExternalOutline'
import AddressExplorerLink from '@components/Common/Links/AddressExplorerLink'
import { Input } from '@components/UIElements/Input'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDid } from '@hooks/useDid'
import useHandleWrongNetwork from '@hooks/useHandleWrongNetwork'
import usePendingTxn from '@hooks/usePendingTxn'
import useNonceStore from '@lib/store/nonce'
import useProfileStore from '@lib/store/profile'
import { Button, Dialog, Flex } from '@radix-ui/themes'
import { LENSHUB_PROXY_ABI } from '@tape.xyz/abis'
import {
  ERROR_MESSAGE,
  LENS_MANAGER_ADDRESS,
  LENSHUB_PROXY_ADDRESS,
  REQUESTING_SIGNATURE_MESSAGE
} from '@tape.xyz/constants'
import { getSignature, shortenAddress } from '@tape.xyz/generic'
import type { Profile } from '@tape.xyz/lens'
import {
  ChangeProfileManagerActionType,
  useBroadcastOnchainMutation,
  useCreateChangeProfileManagersTypedDataMutation,
  useProfileManagersQuery
} from '@tape.xyz/lens'
import type { CustomErrorWithData } from '@tape.xyz/lens/custom-types'
import { Loader } from '@tape.xyz/ui'
import React, { useEffect, useState } from 'react'
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
        <span>
          {address === LENS_MANAGER_ADDRESS ? 'Lens Manager' : did || '-'}
        </span>
        <AddressExplorerLink address={address}>
          <Flex align="center" gap="1">
            <span>{shortenAddress(address)}</span>
            <ExternalOutline className="h-3 w-3" />
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
  const activeProfile = useProfileStore(
    (state) => state.activeProfile
  ) as Profile
  const handleWrongNetwork = useHandleWrongNetwork()

  const { data, refetch, error, loading } = useProfileManagersQuery({
    variables: { request: { for: activeProfile?.id } },
    skip: !activeProfile?.id
  })
  const profileManagers = data?.profileManagers.items

  const onError = (error: CustomErrorWithData) => {
    toast.error(error?.message ?? ERROR_MESSAGE)
    setSubmitting(false)
    setRemovingAddress('')
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
      reset()
      setRemovingAddress('')
      refetch()
      setShowModal(false)
      setSubmitting(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indexed])

  const [toggleLensManager] = useCreateChangeProfileManagersTypedDataMutation({
    onCompleted: async ({ createChangeProfileManagersTypedData }) => {
      const { id, typedData } = createChangeProfileManagersTypedData
      try {
        toast.loading(REQUESTING_SIGNATURE_MESSAGE)
        const signature = await signTypedDataAsync(getSignature(typedData))
        const { data } = await broadcast({
          variables: { request: { id, signature } }
        })
        if (data?.broadcastOnchain?.__typename === 'RelayError') {
          const {
            delegatorProfileId,
            delegatedExecutors,
            approvals,
            configNumber,
            switchToGivenConfig
          } = typedData.value
          return write?.({
            args: [
              delegatorProfileId,
              delegatedExecutors,
              approvals,
              configNumber,
              switchToGivenConfig
            ]
          })
        }
      } catch {
        setSubmitting(false)
      }
    },
    onError
  })

  const addManager = ({ address }: FormData) => {
    if (handleWrongNetwork()) {
      return
    }
    setSubmitting(true)
    toggleLensManager({
      variables: {
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

  const removeManager = (address: string) => {
    if (handleWrongNetwork()) {
      return
    }
    setRemovingAddress(address)
    toggleLensManager({
      variables: {
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
                validationError={errors.address?.message}
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
        {(!loading && !profileManagers?.length) || error ? (
          <NoDataFound withImage isCenter />
        ) : null}
        {profileManagers?.length ? (
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {profileManagers?.map(({ address }) => (
              <Entry
                key={address}
                address={address}
                removingAddress={removingAddress}
                onRemove={(address) => removeManager(address)}
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default Managers
