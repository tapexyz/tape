import { ARWEAVE_WEBSITE_URL } from '@utils/constants'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  playbackId: string | null
}

const playback = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  if (req.method === 'POST') {
    const body = JSON.parse(req.body)
    const isArweaveId = /[a-z0-9_-]{43}/i.test(body.arweaveId)
    if (!body.arweaveId || !isArweaveId)
      res.status(400).json({ playbackId: null })
    const livepeerKey = process.env.LIVEPEER_API_KEY
    const response = await fetch('https://livepeer.com/api/asset/import', {
      headers: {
        Authorization: `Bearer ${livepeerKey}`,
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        url: `${ARWEAVE_WEBSITE_URL}/${body.arweaveId}`,
        name: body.arweaveId
      })
    })
    const result = await response.json()
    res.status(200).json({ playbackId: result.asset.playbackId })
  }
}

export default playback
