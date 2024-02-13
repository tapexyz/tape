import {
  LENS_PERMISSIONLESS_CREATOR_ABI,
  TAPE_SIGNUP_PROXY_ABI
} from '@tape.xyz/abis'
import {
  LENS_PERMISSIONLESS_CREATOR_ADDRESS,
  POLYGON_CHAIN_ID,
  TAPE_SIGNUP_PROXY_ADDRESS
} from '@tape.xyz/constants'
import { Button } from '@tape.xyz/ui'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { formatUnits } from 'viem'
import { useBalance, useReadContract, useWriteContract } from 'wagmi'

const Signup = () => {
  const [loading, setLoading] = useState(false)

  const { data } = useReadContract({
    abi: LENS_PERMISSIONLESS_CREATOR_ABI,
    address: LENS_PERMISSIONLESS_CREATOR_ADDRESS,
    args: [TAPE_SIGNUP_PROXY_ADDRESS],
    functionName: 'getCreditBalance',
    query: { refetchInterval: 2000 }
  })
  const credits = String(data)

  const { data: totalCount } = useReadContract({
    abi: TAPE_SIGNUP_PROXY_ABI,
    address: TAPE_SIGNUP_PROXY_ADDRESS,
    functionName: 'totalCount',
    query: { refetchInterval: 2000 }
  })
  const totalSignupCount = String(totalCount)

  const { data: contractBalance } = useBalance({
    address: TAPE_SIGNUP_PROXY_ADDRESS,
    chainId: POLYGON_CHAIN_ID,
    query: {
      refetchInterval: 2000
    }
  })
  const balance =
    contractBalance && parseFloat(formatUnits(contractBalance.value, 18))

  const { writeContractAsync } = useWriteContract({
    mutation: {
      onSuccess: () => {
        toast.success('Funds withdrawn')
        setLoading(false)
      },
      onError: (error) => {
        toast.error(error.message)
        setLoading(false)
      }
    }
  })

  const withdraw = async () => {
    setLoading(true)
    try {
      await writeContractAsync({
        abi: TAPE_SIGNUP_PROXY_ABI,
        address: TAPE_SIGNUP_PROXY_ADDRESS,
        functionName: 'withdrawFunds'
      })
    } catch {}
  }

  return (
    <div className="space-y-2 p-5">
      <ul>
        <li>Credits: {credits}</li>
        <li>Total Signups: {totalSignupCount}</li>
        <li>Total Balance: {balance}</li>
      </ul>
      <div className="flex">
        <Button disabled={loading} loading={loading} onClick={() => withdraw()}>
          Withdraw funds
        </Button>
      </div>
    </div>
  )
}

export default Signup
