import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import type { Address } from 'viem'
import { createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { polygon, polygonAmoy } from 'viem/chains'
import type { z } from 'zod'
import { any, object } from 'zod'

import {
  TAPE_SIGNUP_PROXY_ABI,
  TAPE_SIGNUP_PROXY_ADDRESS,
  ZERO_ADDRESS
} from '@/helpers/constants'

type Bindings = {
  RELAYER_PRIVATE_KEYS: string
  INGEST_REST_ENDPOINT: string
  LS_WEBHOOK_SECRET: string
}

const app = new Hono<{ Bindings: Bindings }>()

const validationSchema = object({
  meta: any(),
  data: any()
})
type RequestInput = z.infer<typeof validationSchema>

app.post('/', zValidator('json', validationSchema), async (c) => {
  const body = await c.req.json<RequestInput>()
  try {
    const secret = c.env.LS_WEBHOOK_SECRET
    const encoder = new TextEncoder()
    const secretKey = encoder.encode(secret)
    const data = encoder.encode(await c.req.text())
    const providedSignature = c.req.header('X-Signature')
    const key = await crypto.subtle.importKey(
      'raw',
      secretKey,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )
    const digest = await crypto.subtle.sign('HMAC', key, data)
    const computedSignature = Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
    if (providedSignature !== computedSignature) {
      throw new Error('Invalid signature.')
    }
  } catch (error) {
    return c.json({ success: false, message: 'Invalid signature' })
  }

  try {
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
      chain: test_mode ? polygonAmoy : polygon,
      transport: http()
    })

    const hash = await client.writeContract({
      abi: TAPE_SIGNUP_PROXY_ABI,
      address: TAPE_SIGNUP_PROXY_ADDRESS,
      args: [[address, ZERO_ADDRESS, '0x'], handle, [delegatedExecutor]],
      functionName: 'createProfileWithHandle'
    })

    if (!test_mode) {
      const clickhouseBody = `
        INSERT INTO signups (
          handle,
          address,
          email,
          order_number,
          hash
        ) VALUES (
          '${handle}',
          '${address}',
          '${email}',
          '${order_number}',
          '${hash}'
        )
      `
      const clickhouseResponse = await fetch(c.env.INGEST_REST_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: clickhouseBody
      })
      if (clickhouseResponse.status !== 200) {
        return c.json({
          success: false,
          message: 'Failed to ingest to clickhouse!'
        })
      }
    }

    return c.json({ success: true, hash })
  } catch (error) {
    console.log('🚀 ~ signup ~ app.post ~ error:', error)
    return c.json({ success: false, message: error })
  }
})

export default app
