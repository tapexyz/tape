import { createData, EthereumSigner } from '../bundlr'

export interface Env {
  BUNDLR_PRIVATE_KEY: string
}

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json'
}

const handleRequest = async (request: Request, env: Env) => {
  if (request.method !== 'POST') {
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Only POST requests are supported'
      }),
      {
        headers
      }
    )
  }

  const payload = await request.json()

  if (!payload) {
    return new Response(
      JSON.stringify({ success: false, message: 'No body provided' }),
      { headers }
    )
  }

  try {
    const signer = new EthereumSigner(env.BUNDLR_PRIVATE_KEY)
    const tx = createData(JSON.stringify(payload), signer, {
      tags: [
        { name: 'Content-Type', value: 'application/json' },
        { name: 'App-Name', value: 'Lenstube' }
      ]
    })
    await tx.sign(signer)
    const bundlrRes = await fetch('http://node2.bundlr.network/tx/matic', {
      method: 'POST',
      headers: { 'content-type': 'application/octet-stream' },
      body: tx.getRaw()
    })

    if (bundlrRes.statusText === 'Created' || bundlrRes.statusText === 'OK') {
      return new Response(
        JSON.stringify({
          success: true,
          id: tx.id,
          url: `https://arweave.net/${tx.id}`
        }),
        {
          headers
        }
      )
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Something went wrong!',
          bundlrRes
        }),
        {
          headers
        }
      )
    }
  } catch {
    return new Response(
      JSON.stringify({ success: false, message: 'Something went wrong!' }),
      { headers }
    )
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    return await handleRequest(request, env)
  }
}
