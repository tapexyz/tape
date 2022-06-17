import { useMutation } from '@apollo/client'
import { Button } from '@components/UIElements/Button'
import { Input } from '@components/UIElements/Input'
import Modal from '@components/UIElements/Modal'
import { zodResolver } from '@hookform/resolvers/zod'
import useAppStore from '@lib/store'
import { IS_MAINNET } from '@utils/constants'
import { getHandle } from '@utils/functions/getHandle'
import { getRandomProfilePicture } from '@utils/functions/getRandomProfilePicture'
import { isEmptyString } from '@utils/functions/isEmptyString'
import { CREATE_PROFILE_MUTATION } from '@utils/gql/queries'
import useIsMounted from '@utils/hooks/useIsMounted'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import * as z from 'zod'

import PendingTxnLoader from './PendingTxnLoader'

const formSchema = z.object({
  channelName: z
    .string()
    .min(5, { message: 'Name should be atleast 5 characters' })
    .max(30, { message: 'Name should not exceed 30 characters' })
    .regex(/^[a-z0-9]+$/, {
      message: 'Name should only contain alphanumeric characters'
    })
})
type FormData = z.infer<typeof formSchema>

const CreateChannel = () => {
  const { setShowCreateChannel, showCreateChannel } = useAppStore()
  const [creating, setCreating] = useState(false)
  const { mounted } = useIsMounted()
  const router = useRouter()
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(formSchema)
  })

  const [createProfile, { data, reset }] = useMutation(
    CREATE_PROFILE_MUTATION,
    {
      onError() {
        setCreating(false)
      }
    }
  )

  const onCancel = () => {
    setShowCreateChannel(false)
    setCreating(false)
    reset()
  }

  const onIndexed = () => {
    setCreating(false)
    setShowCreateChannel(false)
    router.push(getHandle(getValues().channelName))
  }

  const onCreate = ({ channelName }: FormData) => {
    const username = channelName.toLowerCase()
    if (isEmptyString(username)) {
      return toast.error('Field is required.')
    }
    if (username.length < 5 || username.length > 30) {
      return toast.error('Handle should be 5-30 letters long.')
    }
    setCreating(true)
    createProfile({
      variables: {
        request: {
          handle: username,
          profilePictureUri: getRandomProfilePicture(username)
        }
      }
    })
  }

  return (
    <Modal
      title={IS_MAINNET ? 'Claim Handle 🌿' : 'Create Channel 🌿'}
      onClose={() => setShowCreateChannel(false)}
      show={mounted && showCreateChannel}
      panelClassName="max-w-md"
    >
      {IS_MAINNET ? (
        <div className="mt-4">
          <span className="text-sm opacity-70">
            Your address does not seem to have Lens handle.
          </span>
          <div className="text-base">
            Visit{' '}
            <a
              href="https://claim.lens.xyz/"
              target="_blank"
              className="text-indigo-500"
              rel="noreferrer"
            >
              lens claiming site
            </a>{' '}
            to claim your handle and then check back here.
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onCreate)} className="space-y-4">
          <h6 className="text-sm opacity-70">Your new Lenstube channel</h6>
          <div className="mt-4">
            <Input
              {...register('channelName')}
              label="Channel Name"
              type="text"
              placeholder="T Series"
              autoComplete="off"
              validationError={errors.channelName?.message}
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="w-1/2 truncate">
              {data?.createProfile?.reason && (
                <div>
                  <p className="text-xs font-medium text-red-500">
                    {data?.createProfile?.reason}
                  </p>
                </div>
              )}
            </span>
            <span className="flex items-center">
              {data?.createProfile?.txHash ? (
                <PendingTxnLoader
                  txnHash={data?.createProfile?.txHash}
                  onIndexed={onIndexed}
                />
              ) : (
                <>
                  <Button
                    type="button"
                    disabled={creating}
                    onClick={() => onCancel()}
                    variant="secondary"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={creating}>
                    {creating ? 'Creating...' : 'Create'}
                  </Button>
                </>
              )}
            </span>
          </div>
        </form>
      )}
    </Modal>
  )
}

export default CreateChannel
