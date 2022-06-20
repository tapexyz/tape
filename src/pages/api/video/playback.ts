import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  playbackId: string | null
  success: boolean
}

const playback = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  if (req.method === 'POST') {
    try {
      const body = JSON.parse(req.body)
      const parsed = new URL(body.url)
      if (!body.url || !parsed)
        res.status(400).json({ playbackId: null, success: false })
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
      res
        .status(200)
        .json({ playbackId: result.asset.playbackId, success: true })
    } catch (error) {
      res.status(200).json({ playbackId: null, success: false })
    }
  }
}

export default playback
