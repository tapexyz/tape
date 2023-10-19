import { Input } from '@components/UIElements/Input'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import { zodResolver } from '@hookform/resolvers/zod'
import useHandleWrongNetwork from '@hooks/useHandleWrongNetwork'
import usePendingTxn from '@hooks/usePendingTxn'
import useProfileStore from '@lib/store/profile'
import { Trans } from '@lingui/macro'
import { Button, Dialog, Flex, Table } from '@radix-ui/themes'
import { LENSHUB_PROXY_ABI } from '@tape.xyz/abis'
import {
  ERROR_MESSAGE,
  LENSHUB_PROXY_ADDRESS,
  REQUESTING_SIGNATURE_MESSAGE
} from '@tape.xyz/constants'
import { getSignature, useDid } from '@tape.xyz/generic'
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
  removing,
  onRemove
}: {
  address: string
  removing: boolean
  onRemove: (address: string) => void
}) => {
  const { did } = useDid({ address })
  return (
    <Table.Row key={address}>
      <Table.RowHeaderCell>{address}</Table.RowHeaderCell>
      <Table.RowHeaderCell width="200px">{did || '-'}</Table.RowHeaderCell>
      <Table.Cell justify="end">
        <Button
          onClick={() => onRemove(address)}
          disabled={removing}
          color="red"
          size="1"
          variant="soft"
        >
          <Trans>Remove</Trans>
        </Button>
      </Table.Cell>
    </Table.Row>
  )
}

const Managers = () => {
  const [submitting, setSubmitting] = useState(false)
  const [removing, setRemoving] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(formSchema)
  })

  const userSigNonce = useProfileStore((state) => state.userSigNonce)
  const setUserSigNonce = useProfileStore((state) => state.setUserSigNonce)
  const activeProfile = useProfileStore(
    (state) => state.activeProfile
  ) as Profile
  const handleWrongNetwork = useHandleWrongNetwork()

  const { data, refetch, error, loading } = useProfileManagersQuery({
    variables: { request: { for: activeProfile?.id } },
    skip: !activeProfile?.id,
    fetchPolicy: 'no-cache'
  })
  const profileManagers = data?.profileManagers.items

  const onError = (error: CustomErrorWithData) => {
    toast.error(error?.message ?? ERROR_MESSAGE)
    setSubmitting(false)
    setRemoving(false)
  }

  const { signTypedDataAsync } = useSignTypedData({
    onError
  })

  const { write, data: writeData } = useContractWrite({
    address: LENSHUB_PROXY_ADDRESS,
    abi: LENSHUB_PROXY_ABI,
    functionName: 'changeDelegatedExecutorsConfig',
    onSuccess: () => {
      setUserSigNonce(userSigNonce + 1)
    },
    onError: (error) => {
      onError(error)
      setUserSigNonce(userSigNonce - 1)
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
      refetch()
      setShowModal(false)
      setSubmitting(false)
      toast.success('Profile Manager added')
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
    setRemoving(true)
    toggleLensManager({
      variables: {
        request: {
          approveLensManager: true,
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
      <div className="flex items-center justify-between">
        <p>
          Accounts managing your profile. These accounts can perform any social
          actions on your behalf.
        </p>
        <Dialog.Root open={showModal} onOpenChange={setShowModal}>
          <Dialog.Trigger>
            <Button highContrast>
              <Trans>New Manager</Trans>
            </Button>
          </Dialog.Trigger>

          <Dialog.Content style={{ maxWidth: 550 }}>
            <Dialog.Title>Add new Manager</Dialog.Title>
            <Dialog.Description size="2" mb="4">
              <Trans>
                This delegates permission to the address to perform all social
                operations on your behalf.
              </Trans>
            </Dialog.Description>

            <form onSubmit={handleSubmit(addManager)}>
              <Input
                label="Address"
                placeholder="0x00..."
                validationError={errors.address?.message}
                {...register('address')}
              />
              <Flex gap="3" mt="4" justify="end">
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
        {((!loading && !profileManagers?.length) || error) && (
          <NoDataFound withImage isCenter />
        )}
        {profileManagers?.length && (
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Address</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>DID</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell justify="end">
                  Action
                </Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {profileManagers?.map(({ address }) => (
                <Entry
                  key={address}
                  address={address}
                  removing={removing}
                  onRemove={(address) => removeManager(address)}
                />
              ))}
            </Table.Body>
          </Table.Root>
        )}
      </div>
    </div>
  )
}

export default Managers
