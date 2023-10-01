import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import { array, object, string } from 'zod'

import { resolverAbi } from '../resolverAbi'
import type { WorkerRequest } from '../types'

type ExtensionRequest = {
  addresses: string[]
}

const validationSchema = object({
  addresses: array(string().regex(/^(0x)?[\da-f]{40}$/i)).max(50, {
    message: 'Too many addresses!'
  })
})

const PROFILES_QUERY = `query AllProfiles($ownedBy: [EthereumAddress!]) {
  profiles(request: { ownedBy: $ownedBy }) {
    items {
      handle
      ownedBy
    }
  }
}`

const replaceAddressesWithHandles = (
  profiles: { ownedBy: string; handle: string }[],
  addresses: string[]
) => {
  const handleMap = profiles.reduce(
    (acc: { [address: string]: string }, profile) => {
      if (!acc[profile.ownedBy]) {
        acc[profile.ownedBy] = profile.handle
      }
      return acc
    },
    {}
  )
  return addresses.map((address) => handleMap[address] || address)
}

const resolveENS = async (address: string): Promise<string> => {
  const client = createPublicClient({
    chain: mainnet,
    transport: http('https://ethereum.publicnode.com')
  })
  const data = await client.readContract({
    address: '0x3671ae578e63fdf66ad4f3e12cc0c0d71ac7510c',
    abi: resolverAbi,
    args: [[address]],
    functionName: 'getNames'
  })

  const results: string[] = (data as []) ?? []
  const dids = results?.map((d: string, i) => (Boolean(d.trim()) ? d : address))
  return dids[0]
}

const resolveAllAddresses = async (
  transformedAddresses: string[]
): Promise<string[]> => {
  const resolvedAddresses = await Promise.all(
    transformedAddresses.map(async (addrOrHandle) => {
      if (addrOrHandle.startsWith('0x')) {
        return await resolveENS(addrOrHandle)
      }
      return addrOrHandle
    })
  )
  return resolvedAddresses
}

export default async (request: WorkerRequest) => {
  const body = await request.json()
  if (!body) {
    return new Response(
      JSON.stringify({ success: false, error: 'No body found' })
    )
  }

  const validation = validationSchema.safeParse(body)

  if (!validation.success) {
    return new Response(
      JSON.stringify({ success: false, error: validation.error.issues })
    )
  }

  const { addresses } = body as ExtensionRequest

  try {
    const response = await fetch('https://api.lens.dev/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Lenstube'
      },
      body: JSON.stringify({
        operationName: 'AllProfiles',
        query: PROFILES_QUERY,
        variables: {
          ownedBy: addresses
        }
      })
    })
    const result: any = await response.json()
    const profiles = result?.data?.profiles.items
    const transformedAddresses = replaceAddressesWithHandles(
      profiles,
      addresses
    )

    const dids = await resolveAllAddresses(transformedAddresses)

    return new Response(JSON.stringify({ success: true, dids }))
  } catch (error) {
    throw error
  }
}
