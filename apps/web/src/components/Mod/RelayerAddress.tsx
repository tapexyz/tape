import { ERROR_MESSAGE } from '@tape.xyz/constants'
import type { CustomErrorWithData } from '@tape.xyz/lens/custom-types'
import { Button } from '@tape.xyz/ui'
import { type FC, useState } from 'react'
import toast from 'react-hot-toast'
import type { Address } from 'viem'
import { formatUnits, parseEther } from 'viem'
import { useBalance, useSendTransaction } from 'wagmi'

interface RelayerAddressProps {
  address: Address
}

const RelayerAddress: FC<RelayerAddressProps> = ({ address }) => {
  const [loading, setLoading] = useState(false)

  const { data } = useBalance({
    address: address,
    query: { refetchInterval: 5000 }
  })

  const onError = (error: CustomErrorWithData) => {
    setLoading(false)
    toast.error(error.name ?? error?.message ?? ERROR_MESSAGE)
  }

  const { sendTransactionAsync } = useSendTransaction({
    mutation: {
      onError,
      onSuccess: () => {
        setLoading(true)
      }
    }
  })

  const balance = data ? parseFloat(formatUnits(data.value, 18)) : 0

  const recharge = async () => {
    try {
      setLoading(true)

      return await sendTransactionAsync({
        to: address,
        value: parseEther(balance < 20 ? (20 - balance).toString() : '0')
      })
    } catch (error: any) {
      onError(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mb-1 flex justify-between rounded-xl border px-5 py-4">
      <div>
        {address}
        <div className="font-bold">{balance} MATIC</div>
      </div>
      <Button onClick={recharge} loading={loading} disabled={loading}>
        Fund
      </Button>
    </div>
  )
}

export default RelayerAddress
