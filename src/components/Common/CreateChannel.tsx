import { useMutation } from '@apollo/client'
import { Button } from '@components/UIElements/Button'
import { Input } from '@components/UIElements/Input'
import Modal from '@components/UIElements/Modal'
import useAppStore from '@lib/store'
import { IS_MAINNET } from '@utils/constants'
import { getHandle } from '@utils/functions/getHandle'
import { getRandomProfilePicture } from '@utils/functions/getRandomProfilePicture'
import { isEmptyString } from '@utils/functions/isEmptyString'
import { CREATE_PROFILE_MUTATION } from '@utils/gql/queries'
import usePendingTxn from '@utils/hooks/usePendingTxn'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const CreateChannel = () => {
  const { setShowCreateChannel, showCreateChannel } = useAppStore()
  const [txnHash, setTxnHash] = useState('')
  const [creating, setCreating] = useState(false)
  const { indexed } = usePendingTxn(txnHash)
  const [handle, setHandle] = useState('')
  const router = useRouter()

  const [createProfile, { data, reset, error }] = useMutation(
    CREATE_PROFILE_MUTATION,
    {
      onCompleted({ createProfile }) {
        if (createProfile.txHash) {
          setTxnHash(createProfile.txHash)
        } else {
          setCreating(false)
        }
      },
      onError() {
        setCreating(false)
      }
    }
  )

  useEffect(() => {
    if (indexed) {
      toast.success('Channel created 🎉')
      setCreating(false)
      setShowCreateChannel(false)
      router.push(getHandle(handle))
    }
  }, [indexed, handle, setShowCreateChannel, router])

  const onCancel = () => {
    setShowCreateChannel(false)
    setCreating(false)
    reset()
    setHandle('')
  }

  const create = () => {
    const username = handle.toLowerCase()
    if (isEmptyString(username)) {
      return toast.error('Field is required.')
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
      show={showCreateChannel}
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
              className="text-blue-500"
              rel="noreferrer"
            >
              lens claiming site
            </a>{' '}
            to claim your handle and then check back here.
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="mt-4">
            <Input
              label="Channel Name"
              type="text"
              placeholder="T Series"
              autoComplete="off"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="w-1/2 truncate">
              {(data?.createProfile?.reason || error?.message) && (
                <div>
                  <p className="text-xs font-bold text-red-500">
                    {data?.createProfile?.reason || error?.message}
                  </p>
                </div>
              )}
            </span>
            <span>
              <Button
                disabled={creating}
                onClick={() => onCancel()}
                variant="secondary"
              >
                Cancel
              </Button>
              <Button onClick={() => create()} disabled={creating}>
                {creating ? 'Creating...' : 'Create'}
              </Button>
            </span>
          </div>
        </div>
      )}
    </Modal>
  )
}

export default CreateChannel
