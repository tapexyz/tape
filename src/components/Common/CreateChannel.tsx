import { useMutation } from '@apollo/client'
import { Button } from '@components/UIElements/Button'
import { Input } from '@components/UIElements/Input'
import Modal from '@components/UIElements/Modal'
import { CREATE_PROFILE_MUTATION } from '@gql/queries'
import { zodResolver } from '@hookform/resolvers/zod'
import useAppStore from '@lib/store'
import usePersistStore from '@lib/store/persist'
import { IS_MAINNET } from '@utils/constants'
import { getHandle } from '@utils/functions/getHandle'
import { getRandomProfilePicture } from '@utils/functions/getRandomProfilePicture'
import trimify from '@utils/functions/trimify'
import useIsMounted from '@utils/hooks/useIsMounted'
import usePendingTxn from '@utils/hooks/usePendingTxn'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'

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

export const ClaimHandle = () => (
  <div className="mt-2">
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
)

const CreateChannel = () => {
  const showCreateChannel = useAppStore((state) => state.showCreateChannel)
  const isSignedUser = usePersistStore((state) => state.isSignedUser)
  const setShowCreateChannel = useAppStore(
    (state) => state.setShowCreateChannel
  )
  const [loading, setLoading] = useState(false)
  const [buttonText, setButtonText] = useState('Create')
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

  const onError = () => {
    setLoading(false)
    setButtonText('Create')
  }

  const [createProfile, { data, reset }] = useMutation(
    CREATE_PROFILE_MUTATION,
    {
      onCompleted(data) {
        setButtonText('Indexing...')
        if (data?.createProfile?.reason) {
          setLoading(false)
        }
      },
      onError
    }
  )

  const onCancel = () => {
    setShowCreateChannel(false)
    onError()
    reset()
  }

  const { indexed } = usePendingTxn({
    txHash: data?.createProfile?.txHash
  })

  useEffect(() => {
    if (indexed) {
      setLoading(false)
      setShowCreateChannel(false)
      router.push(`/${getHandle(getValues().channelName)}`)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indexed])

  const onCreate = ({ channelName }: FormData) => {
    const username = trimify(channelName.toLowerCase())
    setLoading(true)
    setButtonText('Creating...')
    createProfile({
      variables: {
        request: {
          handle: username,
          profilePictureUri: getRandomProfilePicture(username)
        }
      }
    })
  }

  if (!isSignedUser) return null

  return (
    <Modal
      title={IS_MAINNET ? 'Claim Handle' : 'Create Channel'}
      onClose={() => setShowCreateChannel(false)}
      show={mounted && showCreateChannel}
      panelClassName="max-w-md"
    >
      {IS_MAINNET ? (
        <ClaimHandle />
      ) : (
        <form onSubmit={handleSubmit(onCreate)} className="space-y-4">
          <h6 className="text-sm opacity-70">Your new Lenstube channel</h6>
          <div className="mt-2">
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
            <span className="flex-wrap w-2/3">
              {data?.createProfile?.reason && (
                <div>
                  <p className="text-xs font-medium text-red-500">
                    {data?.createProfile?.reason === 'HANDLE_TAKEN'
                      ? 'Channel already exists, try unique.'
                      : data?.createProfile?.reason}
                  </p>
                </div>
              )}
            </span>
            <span className="flex items-center">
              <Button
                type="button"
                disabled={loading}
                onClick={() => onCancel()}
                variant="secondary"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading} loading={loading}>
                {buttonText}
              </Button>
            </span>
          </div>
        </form>
      )}
    </Modal>
  )
}

export default CreateChannel
