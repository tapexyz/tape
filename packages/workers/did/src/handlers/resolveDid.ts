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
    }
  }
}`

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
    const client = createPublicClient({
      chain: mainnet,
      transport: http('https://ethereum.publicnode.com')
    })
    // const response = await fetch('https://api.lens.dev/', {
    //   method: 'POST',
    //   body: '{"operationName":"AllProfiles","variables":{"ownedBy":["0x01d79BcEaEaaDfb8fD2F2f53005289CFcF483464"]},"query":"query AllProfiles($ownedBy: [EthereumAddress!]) {\\n  profiles(request: {ownedBy: $ownedBy}) {\\n    items {\\n      handle\\n    }\\n  }\\n}\\n"}'
    // })
    // const result = await response.json()

    const data = await client.readContract({
      address: '0x3671ae578e63fdf66ad4f3e12cc0c0d71ac7510c',
      abi: resolverAbi,
      args: [addresses],
      functionName: 'getNames'
    })

    const results = (data as []) ?? []

    const dids = results?.map((d: string, i) =>
      Boolean(d.trim()) ? d : addresses[i]
    )

    return new Response(JSON.stringify({ success: true, dids }))
  } catch (error) {
    throw error
  }
}
