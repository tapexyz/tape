import { signMetadata } from '@lens-protocol/metadata'
import { Hono } from 'hono'
import { privateKeyToAccount } from 'viem/accounts'

import { ERROR_MESSAGE, IRYS_NODE_URL } from '@/helpers/constants'
import { createData, EthereumSigner } from '@/helpers/metadata'

type Bindings = {
  WALLET_PRIVATE_KEY: string
}

const app = new Hono<{ Bindings: Bindings }>()

app.post('/', async (c) => {
  try {
    const payload = await c.req.json()

    const signer = new EthereumSigner(c.env.WALLET_PRIVATE_KEY)

    const account = privateKeyToAccount(`0x${c.env.WALLET_PRIVATE_KEY}`)
    const signed = await signMetadata(payload, (message) =>
      account.signMessage({ message })
    )

    const tx = createData(JSON.stringify(signed), signer, {
      tags: [
        { name: 'Content-Type', value: 'application/json' },
        { name: 'App-Name', value: 'Tape' }
      ]
    })
    await tx.sign(signer)
    const irysRes = await fetch(IRYS_NODE_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/octet-stream' },
      body: tx.getRaw()
    })

    if (irysRes.statusText !== 'Created' && irysRes.statusText !== 'OK') {
      return c.json({
        success: true,
        message: ERROR_MESSAGE,
        irysRes: JSON.stringify(irysRes)
      })
    }

    return c.json({
      success: true,
      id: tx.id,
      url: `ar://${tx.id}`
    })
  } catch {
    return c.json({ success: false, message: ERROR_MESSAGE })
  }
})

export default app
