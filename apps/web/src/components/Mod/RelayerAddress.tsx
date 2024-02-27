import { type FC } from 'react'
import type { Address } from 'viem'
import { formatUnits } from 'viem'
import { useBalance } from 'wagmi'

interface RelayerAddressProps {
  address: Address
}

const RelayerAddress: FC<RelayerAddressProps> = ({ address }) => {
  const { data } = useBalance({
    address: address,
    query: { refetchInterval: 5000 }
  })

  const balance = data ? parseFloat(formatUnits(data.value, 18)) : 0

  return (
    <div className="mb-1 flex justify-between rounded-xl border px-5 py-4">
      {address}
      <div>
        <b>{balance} </b>MATIC
      </div>
    </div>
  )
}

export default RelayerAddress
