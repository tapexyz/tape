import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import type { Address } from 'viem'
import { createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { polygon, polygonMumbai } from 'viem/chains'
import type { z } from 'zod'
import { any, object } from 'zod'

import {
  ERROR_MESSAGE,
  TAPE_SIGNUP_PROXY_ABI,
  TAPE_SIGNUP_PROXY_ADDRESS,
  ZERO_ADDRESS
} from '@/helpers/constants'

type Bindings = {
  RELAYER_PRIVATE_KEYS: string
  INGEST_REST_ENDPOINT: string
}

const app = new Hono<{ Bindings: Bindings }>()

const validationSchema = object({
  meta: any(),
  data: any()
})
type RequestInput = z.infer<typeof validationSchema>

app.post('/', zValidator('json', validationSchema), async (c) => {
  try {
    const body = await c.req.json<RequestInput>()
    const { data, meta } = body
    const { custom_data, test_mode } = meta
    const { address, delegatedExecutor, handle } = custom_data
    const { order_number, user_email: email } = data.attributes

    // env is delimited by commas with no spaces
    const privateKeys = c.env.RELAYER_PRIVATE_KEYS
    const allPrivateKeys = privateKeys.split(',')
    const randomPrivateKey =
      allPrivateKeys[Math.floor(Math.random() * allPrivateKeys.length)]

    const account = privateKeyToAccount(randomPrivateKey as Address)

    const client = createWalletClient({
      account,
      chain: test_mode ? polygonMumbai : polygon,
      transport: http()
    })

    const hash = await client.writeContract({
      abi: TAPE_SIGNUP_PROXY_ABI,
      address: TAPE_SIGNUP_PROXY_ADDRESS,
      args: [[address, ZERO_ADDRESS, '0x'], handle, [delegatedExecutor]],
      functionName: 'createProfileWithHandle'
    })

    const clickhouseBody = `
        INSERT INTO signups (
          address,
          email,
          handle,
          hash,
          order_number
        ) VALUES (
          '${address}',
          '${email}',
          '${handle}',
          '${hash}',
          '${order_number}'
        )
      `

    const clickhouseResponse = await fetch(c.env.INGEST_REST_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: clickhouseBody
    })

    if (clickhouseResponse.status !== 200) {
      return c.json({ success: false, message: ERROR_MESSAGE })
    }

    return c.json({ success: true, hash })
  } catch {
    return c.json({ success: false, message: ERROR_MESSAGE })
  }
})

export default app
