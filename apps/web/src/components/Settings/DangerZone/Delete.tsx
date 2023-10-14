import useHandleWrongNetwork from '@hooks/useHandleWrongNetwork'
import { signOut } from '@lib/store/auth'
import useChannelStore from '@lib/store/channel'
import { t, Trans } from '@lingui/macro'
import { Button, Card } from '@radix-ui/themes'
import { LENSHUB_PROXY_ABI } from '@tape.xyz/abis'
import {
  LENSHUB_PROXY_ADDRESS,
  REQUESTING_SIGNATURE_MESSAGE
} from '@tape.xyz/constants'
import type { CustomErrorWithData } from '@tape.xyz/lens/custom-types'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import Custom404 from 'src/pages/404'
import { useContractWrite, useWaitForTransaction } from 'wagmi'

const Delete = () => {
  const [loading, setLoading] = useState(false)
  const [txnHash, setTxnHash] = useState<`0x${string}`>()
  const activeChannel = useChannelStore((state) => state.activeChannel)
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
      write?.({ args: [activeChannel?.id] })
    } catch {
      setLoading(false)
    }
  }

  if (!activeChannel) {
    return <Custom404 />
  }

  return (
    <Card size="3">
      <div className="flex flex-wrap items-center justify-between">
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
        <Button color="red" disabled={loading} onClick={() => onClickDelete()}>
          Delete
        </Button>
      </div>
    </Card>
  )
}

export default Delete
