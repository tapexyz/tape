import { signMetadata } from '@lens-protocol/metadata'
import { ERROR_MESSAGE } from '@tape.xyz/constants'
import { Hono } from 'hono'
import { privateKeyToAccount } from 'viem/accounts'

import { createData, EthereumSigner } from '@/helpers/metadata'

const app = new Hono()

app.post('/', async (c) => {
  try {
    const payload = await c.req.json()

    const WALLET_PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY!
    const signer = new EthereumSigner(WALLET_PRIVATE_KEY)

    const account = privateKeyToAccount(`0x${WALLET_PRIVATE_KEY}`)
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
    const irysRes = await fetch('https://arweave.mainnet.irys.xyz/tx/matic', {
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
