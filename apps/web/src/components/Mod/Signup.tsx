import {
  LENS_PERMISSIONLESS_CREATOR_ABI,
  TAPE_SIGNUP_PROXY_ABI
} from '@tape.xyz/abis'
import { tw } from '@tape.xyz/browser'
import {
  LENS_PERMISSIONLESS_CREATOR_ADDRESS,
  POLYGON_CHAIN_ID,
  TAPE_SIGNUP_PROXY_ADDRESS,
  ZERO_ADDRESS
} from '@tape.xyz/constants'
import { useGenerateLensApiRelayAddressQuery } from '@tape.xyz/lens'
import { Button, Input } from '@tape.xyz/ui'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import type { Address } from 'viem'
import { formatUnits } from 'viem'
import { useBalance, useReadContract, useWriteContract } from 'wagmi'

import RelayerAddress from './RelayerAddress'

const RELAYER_ADDRESSES = [
  '0xc4407B6dBC56a6cF06d9B6E637Ae12bf13481a38',
  '0xA8B6A140b53412E5F66a4a0944534059864F9A3f',
  '0x684bf2D496ecd6D1194cf510E2B623721c4A12e5'
]

const Signup = () => {
  const [loading, setLoading] = useState(false)
  const [newMint, setNewMint] = useState({ handle: '', address: '' })

  const { data: relayerAddressData } = useGenerateLensApiRelayAddressQuery({
    fetchPolicy: 'no-cache'
  })
  const delegatedExecutor = relayerAddressData?.generateLensAPIRelayAddress

  const { data } = useReadContract({
    abi: LENS_PERMISSIONLESS_CREATOR_ABI,
    address: LENS_PERMISSIONLESS_CREATOR_ADDRESS,
    args: [TAPE_SIGNUP_PROXY_ADDRESS],
    functionName: 'getCreditBalance',
    query: { refetchInterval: 2000 }
  })
  const credits = String(data)

  const { data: totalCountViaCard } = useReadContract({
    abi: TAPE_SIGNUP_PROXY_ABI,
    address: TAPE_SIGNUP_PROXY_ADDRESS,
    functionName: 'totalCountViaCard',
    query: { refetchInterval: 2000 }
  })
  const { data: totalCountViaCrypto } = useReadContract({
    abi: TAPE_SIGNUP_PROXY_ABI,
    address: TAPE_SIGNUP_PROXY_ADDRESS,
    functionName: 'totalCountViaCrypto',
    query: { refetchInterval: 2000 }
  })

  const { data: contractBalance } = useBalance({
    address: TAPE_SIGNUP_PROXY_ADDRESS,
    chainId: POLYGON_CHAIN_ID,
    query: {
      refetchInterval: 2000
    }
  })
  const balance =
    contractBalance && parseFloat(formatUnits(contractBalance.value, 18))

  const { writeContractAsync, isPending } = useWriteContract({
    mutation: {
      onSuccess: () => {
        toast.success('Write contract successful!')
        setLoading(false)
        setNewMint({ handle: '', address: '' })
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

  const mintForUser = async () => {
    try {
      await writeContractAsync({
        abi: TAPE_SIGNUP_PROXY_ABI,
        address: TAPE_SIGNUP_PROXY_ADDRESS,
        args: [
          [newMint.address, ZERO_ADDRESS, '0x'],
          newMint.handle,
          [delegatedExecutor]
        ],
        functionName: 'createProfileWithHandle'
      })
    } catch {}
  }

  return (
    <div className="space-y-4 py-5">
      <div className="flex flex-wrap gap-2 md:flex-nowrap">
        <div
          className={tw(
            'tape-border flex w-full flex-col space-y-1 rounded-lg px-4 py-3',
            { 'animate-shimmer bg-red-200': Number(credits) < 3000 }
          )}
        >
          <span>🤝 Contract Credits</span>
          <b className="text-xl">{credits}</b>
        </div>
        <div className="tape-border flex w-full flex-col space-y-1 rounded-lg px-4 py-3">
          <span>💁 Total Signups via Crypto</span>
          <b className="text-xl">{String(totalCountViaCrypto)}</b>
        </div>
        <div className="tape-border flex w-full flex-col space-y-1 rounded-lg px-4 py-3">
          <span>💁 Total Signups via Card</span>
          <b className="text-xl">{String(totalCountViaCard)}</b>
        </div>
        <div className="tape-border flex w-full flex-col space-y-1 rounded-lg px-4 py-3">
          <span>💸 Total Crypto Revenue</span>
          <div className="flex justify-between">
            <b className="text-xl">{balance} MATIC</b>
            <Button
              size="xs"
              disabled={loading}
              loading={loading}
              onClick={() => withdraw()}
            >
              Withdraw
            </Button>
          </div>
        </div>
        <div className="tape-border flex w-full flex-col space-y-1 rounded-lg px-4 py-3">
          <span>💸 Total Card Revenue</span>
          <b className="text-xl">{Number(totalCountViaCard || 0) * 6} USD</b>
        </div>
      </div>
      <div>
        <h2 className="mb-2 font-bold">Relayers</h2>
        {RELAYER_ADDRESSES.map((address) => (
          <RelayerAddress key={address} address={address as Address} />
        ))}
      </div>
      <div>
        <h2 className="mb-2 font-bold">Mint for user</h2>
        <div className="flex space-x-2">
          <Input
            className="rounded-lg border border-gray-300 p-2"
            placeholder="Address"
            value={newMint.address}
            onChange={(e) =>
              setNewMint({ ...newMint, address: e.target.value })
            }
          />
          <Input
            className="rounded-lg border border-gray-300 p-2"
            placeholder="Handle"
            value={newMint.handle}
            onChange={(e) => setNewMint({ ...newMint, handle: e.target.value })}
          />
          <Button
            disabled={isPending}
            loading={isPending}
            onClick={() => mintForUser()}
          >
            Mint
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Signup
