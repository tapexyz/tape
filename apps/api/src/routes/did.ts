import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { createPublicClient, http, isAddress } from 'viem'
import { mainnet } from 'viem/chains'
import type { z } from 'zod'
import { array, object, string } from 'zod'

import {
  ERROR_MESSAGE,
  LENS_API_URL,
  PUBLIC_ETHEREUM_NODE
} from '@/helpers/constants'
import { resolverAbi } from '@/helpers/did/resolverAbi'

const app = new Hono()

const validationSchema = object({
  addresses: array(string().regex(/^(0x)?[\da-f]{40}$/i)).max(50, {
    message: 'Too many addresses!'
  })
})
type RequestInput = z.infer<typeof validationSchema>

const PROFILES_QUERY = `query Profiles($ownedBy: [EvmAddress!]) {
  profiles(request: { where: { ownedBy: $ownedBy } }) {
    items {
      id
      handle {
        fullHandle
        ownedBy
      }
    }
  }
}`

const replaceAddressesWithHandles = (
  profiles: { handle: { fullHandle: string; ownedBy: string }; id: string }[],
  addresses: string[]
) => {
  const handleMap = profiles.reduce(
    (acc: { [address: string]: string }, profile) => {
      if (!acc[profile.handle.ownedBy]) {
        acc[profile.handle.ownedBy] = profile.handle.fullHandle || profile.id
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
    transport: http(PUBLIC_ETHEREUM_NODE)
  })
  const data = await client.readContract({
    address: '0x3671ae578e63fdf66ad4f3e12cc0c0d71ac7510c',
    abi: resolverAbi,
    args: [[address]],
    functionName: 'getNames'
  })

  const results: string[] = (data as []) ?? []
  const dids = results?.map((d: string) => (Boolean(d.trim()) ? d : address))
  return dids[0]
}

const resolveAllAddresses = async (
  transformedAddresses: string[]
): Promise<string[]> => {
  const resolvedAddresses = await Promise.all(
    transformedAddresses.map(async (addrOrHandle) => {
      if (isAddress(addrOrHandle)) {
        return await resolveENS(addrOrHandle)
      }
      return addrOrHandle
    })
  )
  return resolvedAddresses
}

app.post('/', zValidator('json', validationSchema), async (c) => {
  try {
    const { addresses } = await c.req.json<RequestInput>()

    const response = await fetch(LENS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Tape'
      },
      body: JSON.stringify({
        operationName: 'Profiles',
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

    return c.json({ success: true, dids })
  } catch {
    return c.json({ success: false, message: ERROR_MESSAGE })
  }
})

export default app
