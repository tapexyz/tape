import { zodResolver } from '@hookform/resolvers/zod'
import usePendingTxn from '@hooks/usePendingTxn'
import { COMMON_REGEX, ERROR_MESSAGE, IS_MAINNET } from '@tape.xyz/constants'
import { shortenAddress } from '@tape.xyz/generic'
import { useCreateProfileWithHandleMutation } from '@tape.xyz/lens'
import type { CustomErrorWithData } from '@tape.xyz/lens/custom-types'
import { Button, Callout, Input, WarningOutline } from '@tape.xyz/ui'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useAccount } from 'wagmi'
import type { z } from 'zod'
import { object, string } from 'zod'

const formSchema = object({
  handle: string()
    .min(5, { message: 'Handle should be at least 5 characters' })
    .max(31, { message: 'Handle should not exceed 31 characters' })
    .regex(COMMON_REGEX.HANDLE, {
      message: 'Handle should only contain alphanumeric characters'
    })
})
type FormData = z.infer<typeof formSchema>

const Signup = ({ onSuccess }: { onSuccess: () => void }) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset
  } = useForm<FormData>({
    resolver: zodResolver(formSchema)
  })

  const [creating, setCreating] = useState(false)
  const { address } = useAccount()

  const onError = (error: CustomErrorWithData) => {
    setCreating(false)
    toast.error(error?.data?.message ?? error?.message ?? ERROR_MESSAGE)
  }

  const [createProfileWithHandle, { data }] =
    useCreateProfileWithHandleMutation({
      onError,
      onCompleted: ({ createProfileWithHandle }) => {
        if (
          createProfileWithHandle.__typename ===
          'CreateProfileWithHandleErrorResult'
        ) {
          setCreating(false)
          toast.error(createProfileWithHandle.reason)
        }
      }
    })

  const { indexed, error } = usePendingTxn({
    txId:
      data?.createProfileWithHandle.__typename === 'RelaySuccess'
        ? data?.createProfileWithHandle?.txId
        : undefined
  })

  useEffect(() => {
    if (indexed) {
      onSuccess()
      reset()
      toast.success('Profile created')
      setCreating(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indexed, error])

  const signup = async ({ handle }: FormData) => {
    setCreating(true)
    await createProfileWithHandle({
      variables: { request: { handle: handle.toLowerCase(), to: address } }
    })
  }

  return (
    <div className="space-y-4">
      <Callout variant="danger" icon={<WarningOutline className="size-4" />}>
        We couldn't find any profiles linked to the connected address. (
        {shortenAddress(address as string)})
      </Callout>
      {!IS_MAINNET && (
        <div className="space-y-1">
          <div className="font-medium">Create Profile</div>
          <form
            onSubmit={handleSubmit(signup)}
            className="flex justify-end space-x-2"
          >
            <Input
              placeholder="gilfoyle"
              autoComplete="off"
              error={errors.handle?.message}
              {...register('handle')}
            />
            <div className="flex-none">
              <Button loading={creating} disabled={creating}>
                Sign up
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default Signup
