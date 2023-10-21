import useHandleWrongNetwork from '@hooks/useHandleWrongNetwork'
import { signOut } from '@lib/store/auth'
import useProfileStore from '@lib/store/profile'
import { t, Trans } from '@lingui/macro'
import { Button } from '@radix-ui/themes'
import { LENSHUB_PROXY_ABI } from '@tape.xyz/abis'
import {
  LENSHUB_PROXY_ADDRESS,
  REQUESTING_SIGNATURE_MESSAGE
} from '@tape.xyz/constants'
import type { CustomErrorWithData } from '@tape.xyz/lens/custom-types'
import { Loader } from '@tape.xyz/ui'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import Custom404 from 'src/pages/404'
import { useContractWrite, useWaitForTransaction } from 'wagmi'

const Delete = () => {
  const [loading, setLoading] = useState(false)
  const [txnHash, setTxnHash] = useState<`0x${string}`>()
  const activeProfile = useProfileStore((state) => state.activeProfile)
  const handleWrongNetwork = useHandleWrongNetwork()

  const onError = (error: CustomErrorWithData) => {
    setLoading(false)
    toast.error(error?.data?.message ?? error?.message)
  }

  const { write } = useContractWrite({
    address: LENSHUB_PROXY_ADDRESS,
    abi: LENSHUB_PROXY_ABI,
    functionName: 'burn',
    onError,
    onSuccess: (data) => setTxnHash(data.hash)
  })

  useWaitForTransaction({
    enabled: txnHash && txnHash.length > 0,
    hash: txnHash,
    onSuccess: () => {
      toast.success(t`Channel deleted`)
      setLoading(false)
      signOut()
      location.href = '/'
    },
    onError
  })

  const onClickDelete = () => {
    if (handleWrongNetwork()) {
      return
    }
    setLoading(true)
    try {
      toast.loading(REQUESTING_SIGNATURE_MESSAGE)
      write?.({ args: [activeProfile?.id] })
    } catch {
      setLoading(false)
    }
  }

  if (!activeProfile) {
    return <Custom404 />
  }

  return (
    <div className="flex flex-wrap items-center justify-between pt-6">
      <div className="space-y-2">
        <h1 className="text-xl font-bold text-red-500">
          <Trans>Delete Profile</Trans>
        </h1>
        <p>
          <Trans>Delete your profile and its data.</Trans>
          <span className="ml-1 text-red-500">
            <Trans>It can not be reverted</Trans>
          </span>
        </p>
      </div>
      <Button
        size="3"
        color="red"
        disabled={loading}
        onClick={() => onClickDelete()}
      >
        {loading && <Loader size="sm" />}
        <Trans>Delete</Trans>
      </Button>
    </div>
  )
}

export default Delete
