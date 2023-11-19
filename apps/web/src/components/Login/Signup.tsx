import WarningOutline from '@components/Common/Icons/WarningOutline'
import { Input } from '@components/UIElements/Input'
import { COMMON_REGEX, ERROR_MESSAGE, IS_MAINNET } from '@dragverse/constants'
import { shortenAddress } from '@dragverse/generic'
import { useCreateProfileWithHandleMutation } from '@dragverse/lens'
import type { CustomErrorWithData } from '@dragverse/lens/custom-types'
import { Loader } from '@dragverse/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import usePendingTxn from '@hooks/usePendingTxn'
import { Button, Callout, Text } from '@radix-ui/themes'
import { useEffect, useState } from 'react'
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
      <Callout.Root color="red">
        <Callout.Icon>
          <WarningOutline className="h-4 w-4" />
        </Callout.Icon>
        <Callout.Text highContrast>
          We couldn't find any profiles linked to the connected address. (
          {shortenAddress(address as string)})
        </Callout.Text>
      </Callout.Root>
      {!IS_MAINNET && (
        <div className="space-y-1">
          <Text as="div" weight="medium">
            Create Profile
          </Text>
          <form
            onSubmit={handleSubmit(signup)}
            className="flex justify-end space-x-2"
          >
            <Input
              placeholder="gilfoyle"
              autoComplete="off"
              validationError={errors.handle?.message}
              {...register('handle')}
            />
            <Button disabled={creating} highContrast>
              {creating && <Loader size="sm" />}
              Sign up
            </Button>
          </form>
        </div>
      )}
    </div>
  )
}

export default Signup
