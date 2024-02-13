import AddressExplorerLink from '@components/Common/Links/AddressExplorerLink'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDid } from '@hooks/useDid'
import useHandleWrongNetwork from '@hooks/useHandleWrongNetwork'
import usePendingTxn from '@hooks/usePendingTxn'
import useProfileStore from '@lib/store/idb/profile'
import useNonceStore from '@lib/store/nonce'
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
import { Button, ExternalOutline, Input, Modal, Spinner } from '@tape.xyz/ui'
import React, { useEffect, useMemo, useState } from 'react'
import { useInView } from 'react-cool-inview'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { isAddress } from 'viem'
import { useSignTypedData, useWriteContract } from 'wagmi'
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
          <div className="flex items-center gap-1">
            <span>{shortenAddress(address)}</span>
            <ExternalOutline className="size-3" />
          </div>
        </AddressExplorerLink>
      </div>
      <Button
        onClick={() => onRemove(address)}
        disabled={removingAddress === address}
        color="red"
        variant="secondary"
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
    mutation: { onError }
  })

  const { writeContractAsync, data: writeHash } = useWriteContract({
    mutation: {
      onSuccess: () => {
        setLensHubOnchainSigNonce(lensHubOnchainSigNonce + 1)
      },
      onError: (error) => {
        onError(error)
        setLensHubOnchainSigNonce(lensHubOnchainSigNonce - 1)
      }
    }
  })

  const write = async ({ args }: { args: any[] }) => {
    return await writeContractAsync({
      address: LENSHUB_PROXY_ADDRESS,
      abi: LENSHUB_PROXY_ABI,
      functionName: 'changeDelegatedExecutorsConfig',
      args
    })
  }

  const [broadcast, { data: broadcastData }] = useBroadcastOnchainMutation({
    onError,
    onCompleted: ({ broadcastOnchain }) =>
      onCompleted(broadcastOnchain.__typename)
  })

  const { indexed } = usePendingTxn({
    txHash: writeHash,
    ...(broadcastData?.broadcastOnchain.__typename === 'RelaySuccess' && {
      txId: broadcastData?.broadcastOnchain?.txId
    })
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
            return await write({ args })
          }
          return
        }
        return await write({ args })
      } catch {
        setSubmitting(false)
      }
    },
    onError
  })

  const addManager = async ({ address }: FormData) => {
    await handleWrongNetwork()

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
    await handleWrongNetwork()

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
        <Button onClick={() => setShowModal(true)}>New Manager</Button>
        <Modal
          title="New Manager"
          description="This delegates permission to the address to perform all social
              operations on your behalf."
          show={showModal}
          setShow={setShowModal}
        >
          <form onSubmit={handleSubmit(addManager)}>
            <Input
              label="Address"
              placeholder="0x00..."
              error={errors.address?.message}
              {...register('address')}
            />
            <div className="mt-4 flex justify-end gap-2">
              <Button
                type="button"
                onClick={() => {
                  reset()
                  setShowModal(false)
                }}
                variant="secondary"
              >
                Cancel
              </Button>
              <Button disabled={submitting} loading={submitting}>
                Submit
              </Button>
            </div>
          </form>
        </Modal>
      </div>
      <div className="mt-3">
        {loading && <Spinner className="my-10" />}
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
            <Spinner />
          </span>
        )}
      </div>
    </div>
  )
}

export default Managers
