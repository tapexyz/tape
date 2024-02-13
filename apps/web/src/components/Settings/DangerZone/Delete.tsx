import useHandleWrongNetwork from '@hooks/useHandleWrongNetwork'
import { signOut } from '@lib/store/auth'
import useProfileStore from '@lib/store/idb/profile'
import { LENSHUB_PROXY_ABI } from '@tape.xyz/abis'
import {
  LENSHUB_PROXY_ADDRESS,
  REQUESTING_SIGNATURE_MESSAGE
} from '@tape.xyz/constants'
import type { CustomErrorWithData } from '@tape.xyz/lens/custom-types'
import { Button } from '@tape.xyz/ui'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Custom404 from 'src/pages/404'
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi'

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

  const { writeContractAsync } = useWriteContract({
    mutation: {
      onError,
      onSuccess: (txnHash) => setTxnHash(txnHash)
    }
  })

  const { isError, isSuccess, error } = useWaitForTransactionReceipt({
    query: {
      enabled: txnHash && txnHash.length > 0
    },

    hash: txnHash
  })

  useEffect(() => {
    if (isError) {
      onError(error)
    }
    if (isSuccess) {
      signOut()
      setLoading(false)
      toast.success(`Profile deleted`)
      location.href = '/'
    }
  }, [isError, isSuccess, error])

  const isCooldownEnded = () => {
    const cooldownDate = activeProfile?.guardian?.cooldownEndsOn
    return new Date(cooldownDate).getTime() < Date.now()
  }

  const onClickDelete = async () => {
    if (guardianEnabled || !isCooldownEnded()) {
      return toast.error('Profile Guardian enabled')
    }
    await handleWrongNetwork()

    setLoading(true)
    try {
      toast.loading(REQUESTING_SIGNATURE_MESSAGE)
      await writeContractAsync({
        address: LENSHUB_PROXY_ADDRESS,
        abi: LENSHUB_PROXY_ABI,
        functionName: 'burn',
        args: [activeProfile?.id]
      })
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
        <Button
          variant="danger"
          disabled={loading}
          loading={loading}
          onClick={() => onClickDelete()}
        >
          Delete
        </Button>
      </div>
    </div>
  )
}

export default Delete
