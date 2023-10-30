import useHandleWrongNetwork from '@hooks/useHandleWrongNetwork'
import { signOut } from '@lib/store/auth'
import useProfileStore from '@lib/store/profile'
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
  const activeProfile = useProfileStore((state) => state.activeProfile)
  const handleWrongNetwork = useHandleWrongNetwork()
  const guardianEnabled = activeProfile?.guardian?.protected

  const [loading, setLoading] = useState(false)
  const [txnHash, setTxnHash] = useState<`0x${string}`>()

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
      signOut()
      setLoading(false)
      toast.success(`Profile deleted`)
      location.href = '/'
    },
    onError
  })

  const isCooldownEnded = () => {
    const cooldownDate = activeProfile?.guardian?.cooldownEndsOn
    return new Date(cooldownDate).getTime() < Date.now()
  }

  const onClickDelete = () => {
    if (guardianEnabled || !isCooldownEnded()) {
      return toast.error('Profile Guardian enabled')
    }
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
    <div className="tape-border rounded-medium dark:bg-cod mb-4 bg-white">
      <div className="space-y-2 p-5">
        <h1 className="text-xl font-bold text-red-500">Delete Profile</h1>
        <p>
          Delete your profile and its data.
          <span className="ml-1 text-red-500">It can not be reverted</span>
        </p>
      </div>
      <div className="rounded-b-medium flex justify-end border-b-0 bg-red-100 px-5 py-3 dark:bg-red-900/20">
        <Button color="red" disabled={loading} onClick={() => onClickDelete()}>
          {loading && <Loader size="sm" />}
          Delete
        </Button>
      </div>
    </div>
  )
}

export default Delete
