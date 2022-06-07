import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  playbackId: string | null
}

const playback = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  if (req.method === 'POST') {
    const body = JSON.parse(req.body)
    const parsed = new URL(body.url)
    if (!body.url || !parsed) res.status(400).json({ playbackId: null })
    const livepeerKey = process.env.LIVEPEER_API_KEY
    const response = await fetch('https://livepeer.com/api/asset/import', {
      headers: {
        Authorization: `Bearer ${livepeerKey}`,
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        url: body.url,
        name: parsed.pathname
      })
    })
    const result = await response.json()
    res.status(200).json({ playbackId: result.asset.playbackId })
  }
}

export default playback
