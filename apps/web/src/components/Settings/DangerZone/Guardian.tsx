import { Countdown } from '@components/UIElements/CountDown'
import useProfileStore from '@lib/store/profile'
import { Trans } from '@lingui/macro'
import { Button } from '@radix-ui/themes'
import { LENSHUB_PROXY_ABI } from '@tape.xyz/abis'
import { ERROR_MESSAGE, LENSHUB_PROXY_ADDRESS } from '@tape.xyz/constants'
import type { Profile } from '@tape.xyz/lens'
import { useProfileLazyQuery } from '@tape.xyz/lens'
import type { CustomErrorWithData } from '@tape.xyz/lens/custom-types'
import clsx from 'clsx'
import type { FC } from 'react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import useHandleWrongNetwork from 'src/hooks/useHandleWrongNetwork'
import { useContractWrite, useWaitForTransaction } from 'wagmi'

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
        forHandle: activeProfile?.handle
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

  const { data: disableData, write: disableWrite } = useContractWrite({
    address: LENSHUB_PROXY_ADDRESS,
    abi: LENSHUB_PROXY_ABI,
    functionName: 'DANGER__disableTokenGuardian',
    onError
  })

  const { data: enableData, write: enableWrite } = useContractWrite({
    address: LENSHUB_PROXY_ADDRESS,
    abi: LENSHUB_PROXY_ABI,
    functionName: 'enableTokenGuardian',
    onError
  })

  useWaitForTransaction({
    hash: disableData?.hash ?? enableData?.hash,
    onSuccess: () => {
      setGuardianEnabled(!guardianEnabled)
      setLoading(false)
      fetchProfile()
    },
    enabled: Boolean(disableData?.hash.length ?? enableData?.hash.length)
  })

  const toggle = async () => {
    if (!activeProfile?.id) {
      return toast.error('Sign in to proceed')
    }

    if (handleWrongNetwork()) {
      return
    }

    try {
      setLoading(true)
      if (guardianEnabled) {
        return disableWrite()
      }
      return enableWrite()
    } catch (error) {
      onError(error as any)
    }
  }

  const isCooldownEnded = () => {
    const cooldownDate = activeProfile?.guardian?.cooldownEndsOn
    return new Date(cooldownDate).getTime() < Date.now()
  }

  return (
    <div className="py-6">
      <div className="space-y-2">
        <h1 className="text-xl font-bold text-red-500">
          <Trans>Disable profile guardian</Trans>
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
        </ul>
      </div>

      <div
        className={clsx(
          'flex items-center pt-6',
          isCooldownEnded() ? 'justify-end' : 'justify-between'
        )}
      >
        {!isCooldownEnded() && (
          <span className="flex items-center space-x-2">
            <span>
              <Trans>Cooldown period ends in:</Trans>{' '}
            </span>
            <Countdown timestamp={activeProfile?.guardian?.cooldownEndsOn} />
          </span>
        )}
        {guardianEnabled ? (
          <Button
            size="3"
            color="red"
            disabled={loading}
            onClick={() => toggle()}
          >
            {loading ? <Trans>Disabling</Trans> : <Trans>Disable</Trans>}
          </Button>
        ) : (
          <Button
            size="3"
            disabled={loading}
            highContrast
            onClick={() => toggle()}
          >
            {loading ? <Trans> Enabling</Trans> : <Trans>Enable</Trans>}
          </Button>
        )}
      </div>
    </div>
  )
}

export default Guardian
