import { zodResolver } from '@hookform/resolvers/zod'
import usePendingTxn from '@hooks/usePendingTxn'
import { TAPE_PERMISSIONLESS_ABI } from '@tape.xyz/abis'
import { useDebounce } from '@tape.xyz/browser'
import {
  COMMON_REGEX,
  ERROR_MESSAGE,
  LENS_NAMESPACE_PREFIX,
  TAPE_PERMISSIONLESS_ADDRESS
} from '@tape.xyz/constants'
import { useProfileLazyQuery } from '@tape.xyz/lens'
import type { CustomErrorWithData } from '@tape.xyz/lens/custom-types'
import {
  Button,
  CheckOutline,
  Input,
  Spinner,
  TimesOutline,
  Tooltip
} from '@tape.xyz/ui'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { parseEther } from 'viem'
import { useAccount, useWriteContract } from 'wagmi'
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

const Signup = ({
  showLogin,
  onSuccess,
  setShowSignup
}: {
  showLogin: boolean
  onSuccess: () => void
  setShowSignup: (b: boolean) => void
}) => {
  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
    reset,
    watch
  } = useForm<FormData>({
    resolver: zodResolver(formSchema)
  })

  const [creating, setCreating] = useState(false)
  const [isHandleAvailable, setIsHandleAvailable] = useState(false)

  const { address } = useAccount()
  const handle = watch('handle')

  const [checkAvailability, { loading: checkingAvailability }] =
    useProfileLazyQuery()
  const debouncedValue = useDebounce<string>(handle, 500)

  const onError = (error: CustomErrorWithData) => {
    setCreating(false)
    toast.error(error?.data?.message ?? error?.message ?? ERROR_MESSAGE)
  }

  const { writeContractAsync, data: txnHash } = useWriteContract({
    mutation: {
      onError,
      onSuccess: () => {
        setCreating(false)
      }
    }
  })

  const onSearchDebounce = async () => {
    if (handle?.trim().length) {
      const { data } = await checkAvailability({
        variables: {
          request: {
            forHandle: `${LENS_NAMESPACE_PREFIX}${handle}`
          }
        }
      })
      if (data?.profile) {
        return setIsHandleAvailable(false)
      }
      setIsHandleAvailable(true)
    }
  }

  useEffect(() => {
    onSearchDebounce()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue])

  const { indexed, error } = usePendingTxn({
    ...(txnHash && {
      txHash: txnHash
    })
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
    return await writeContractAsync({
      abi: TAPE_PERMISSIONLESS_ABI,
      address: TAPE_PERMISSIONLESS_ADDRESS,
      args: [
        [address, '0x0000000000000000000000000000000000000000', '0x'],
        handle,
        ['0x6C1e1bC39b13f9E0Af9424D76De899203F47755F']
      ],
      functionName: 'createProfileWithHandleUsingCredits',
      value: parseEther('1')
    })
  }

  return (
    <form onSubmit={handleSubmit(signup)} className="space-y-2">
      <div className="relative flex items-center">
        <Input
          placeholder="gilfoyle"
          autoComplete="off"
          prefix={`@${LENS_NAMESPACE_PREFIX}`}
          error={errors.handle?.message}
          {...register('handle')}
        />
        {isValid && (
          <div className="flex items-center">
            {checkingAvailability ? (
              <span className="absolute right-3 text-white">
                <Spinner size="sm" />
              </span>
            ) : (
              <Tooltip
                content={
                  isHandleAvailable
                    ? `@${LENS_NAMESPACE_PREFIX}${handle} is available`
                    : `@${LENS_NAMESPACE_PREFIX}${handle} is taken`
                }
                placement="top"
              >
                {isHandleAvailable ? (
                  <span className="absolute right-3 rounded-full bg-green-500 p-1 text-white">
                    <CheckOutline className="size-2" />
                  </span>
                ) : (
                  <span className="absolute right-3 rounded-full bg-red-500 p-1 text-white">
                    <TimesOutline className="size-2" outlined={false} />
                  </span>
                )}
              </Tooltip>
            )}
          </div>
        )}
      </div>
      <Button size="md" loading={creating} disabled={creating}>
        Sign up
      </Button>
      {showLogin && (
        <div className="flex items-center justify-center space-x-2 pt-3 text-sm">
          <span>Have an account?</span>
          <button
            type="button"
            className="text-brand-500 font-bold"
            onClick={() => setShowSignup(false)}
          >
            Login
          </button>
        </div>
      )}
    </form>
  )
}

export default Signup
