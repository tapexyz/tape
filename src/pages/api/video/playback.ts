import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  playbackId: string | null
}

const playback = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  if (req.method === 'POST') {
    const body = JSON.parse(req.body)
    const isArweaveId = /[a-z0-9_-]{43}/i.test(body.arweaveId)
    console.log(
      '🚀 ~ file: playback.ts ~ line 11 ~ playback ~ isUrl',
      isArweaveId
    )
    if (!body.arweaveId || !isArweaveId)
      res.status(400).json({ playbackId: null })
    const id = body.url.split('.net/')[1]
    const livepeerKey = process.env.LIVEPEER_API_KEY
    const response = await fetch('https://livepeer.com/api/asset/import', {
      headers: {
        Authorization: `Bearer ${livepeerKey}`,
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        url: body.url,
        name: id
      })
    })
    const result = await response.json()
    res.status(200).json({ playbackId: result.asset.playbackId })
  }
}

export default playback
