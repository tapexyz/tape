import { TAPE_SIGNUP_PROXY_ABI } from '@tape.xyz/abis'
import { TAPE_SIGNUP_PROXY_ADDRESS } from '@tape.xyz/constants'
import { type FC } from 'react'
import type { Address } from 'viem'
import { formatUnits } from 'viem'
import { useBalance, useReadContract } from 'wagmi'

interface RelayerAddressProps {
  address: Address
}

const RelayerAddress: FC<RelayerAddressProps> = ({ address }) => {
  const { data } = useBalance({
    address: address,
    query: { refetchInterval: 5000 }
  })

  const { data: allowed } = useReadContract({
    abi: TAPE_SIGNUP_PROXY_ABI,
    address: TAPE_SIGNUP_PROXY_ADDRESS,
    args: [address],
    functionName: 'allowedRelayerAddresses'
  })

  const balance = data ? parseFloat(formatUnits(data.value, 18)) : 0

  return (
    <div className="mb-1 flex flex-wrap justify-between rounded-xl border px-5 py-4">
      <div className="truncate">{address}</div>
      <div>
        {allowed ? '✅' : '❌'}
        <b> {balance} </b>MATIC
      </div>
    </div>
  )
}

export default RelayerAddress
