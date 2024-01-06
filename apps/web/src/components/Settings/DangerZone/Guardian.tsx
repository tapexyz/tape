import { Countdown } from '@components/UIElements/CountDown'
import useProfileStore from '@lib/store/idb/profile'
import { Button } from '@radix-ui/themes'
import { LENSHUB_PROXY_ABI } from '@tape.xyz/abis'
import {
  ERROR_MESSAGE,
  LENSHUB_PROXY_ADDRESS,
  SIGN_IN_REQUIRED
} from '@tape.xyz/constants'
import type { Profile } from '@tape.xyz/lens'
import { useProfileLazyQuery } from '@tape.xyz/lens'
import type { CustomErrorWithData } from '@tape.xyz/lens/custom-types'
import { Loader } from '@tape.xyz/ui'
import clsx from 'clsx'
import type { FC } from 'react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import useHandleWrongNetwork from 'src/hooks/useHandleWrongNetwork'
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi'

const Guardian: FC = () => {
  const { activeProfile, setActiveProfile } = useProfileStore()

  const [loading, setLoading] = useState(false)
  const [guardianEnabled, setGuardianEnabled] = useState(
    activeProfile?.guardian?.protected
  )
  const handleWrongNetwork = useHandleWrongNetwork()

  const [fetchProfile] = useProfileLazyQuery({
    variables: {
      request: {
        forHandle: activeProfile?.handle?.fullHandle
      }
    },
    fetchPolicy: 'no-cache',
    onCompleted: ({ profile }) => {
      if (profile) {
        setActiveProfile(profile as Profile)
      }
    }
  })

  const onError = (error: CustomErrorWithData) => {
    toast.error(error?.data?.message ?? error?.message ?? ERROR_MESSAGE)
    setLoading(false)
  }

  const { data: disableHash, writeContract: disableWrite } = useWriteContract({
    mutation: {
      onError
    }
  })

  const { data: enableHash, writeContract: enableWrite } = useWriteContract({
    mutation: {
      onError
    }
  })

  const { isSuccess } = useWaitForTransactionReceipt({
    hash: disableHash ?? enableHash
  })

  useEffect(() => {
    if (isSuccess) {
      setGuardianEnabled(!guardianEnabled)
      setLoading(false)
      fetchProfile()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess])

  const toggle = async () => {
    if (!activeProfile?.id) {
      return toast.error(SIGN_IN_REQUIRED)
    }

    if (handleWrongNetwork()) {
      return
    }

    try {
      setLoading(true)
      if (guardianEnabled) {
        return disableWrite({
          address: LENSHUB_PROXY_ADDRESS,
          abi: LENSHUB_PROXY_ABI,
          functionName: 'DANGER__disableTokenGuardian'
        })
      }
      return enableWrite({
        address: LENSHUB_PROXY_ADDRESS,
        abi: LENSHUB_PROXY_ABI,
        functionName: 'DANGER__disableTokenGuardian'
      })
    } catch (error) {
      onError(error as any)
    }
  }

  const isCooldownEnded = () => {
    const cooldownDate = activeProfile?.guardian?.cooldownEndsOn
    return new Date(cooldownDate).getTime() < Date.now()
  }

  return (
    <div className="tape-border rounded-medium dark:bg-cod mb-4 bg-white">
      <div className="space-y-2 p-5">
        <h1 className="text-xl font-bold text-red-500">
          Disable profile guardian
        </h1>
        <p>
          This will disable the Profile Guardian and allow you to do some
          actions like transfer, burn and approve without restrictions.
        </p>
        <ul className="list-inside list-disc">
          <li>
            A 7-day Security Cooldown Period need to be elapsed for the Profile
            Guardian to become effectively disabled.
          </li>
          <li>
            After Profile Guardian is effectively disabled, you will be able to
            execute approvals and transfers without restrictions.
          </li>
          <li>
            Disabling for one profile, disables guardian for other profiles that
            your wallet holds.
          </li>
        </ul>
      </div>

      <div
        className={clsx(
          'rounded-b-medium flex border-b-0 bg-red-100 px-5 py-3 dark:bg-red-900/20',
          isCooldownEnded() ? 'justify-end' : 'justify-between'
        )}
      >
        {!isCooldownEnded() && (
          <span className="flex items-center space-x-2">
            <span>Cooldown period ends in: </span>
            <Countdown
              timestamp={activeProfile?.guardian?.cooldownEndsOn}
              endText="Cooldown period ended"
            />
          </span>
        )}
        {guardianEnabled ? (
          <Button color="red" disabled={loading} onClick={() => toggle()}>
            {loading && <Loader size="sm" />}
            {loading ? 'Disabling' : 'Disable'}
          </Button>
        ) : (
          <Button
            variant="surface"
            disabled={loading}
            highContrast
            onClick={() => toggle()}
          >
            {loading && <Loader size="sm" />}
            {loading ? 'Enabling' : 'Enable'}
          </Button>
        )}
      </div>
    </div>
  )
}

export default Guardian
