import axios from 'axios'
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
      const response: any = await axios({
        method: 'post',
        url: 'https://livepeer.studio/api/asset/import',
        data: {
          url: body.url,
          name: parsed.pathname
        },
        headers: {
          Authorization: `Bearer ${livepeerKey}`,
          'Content-Type': 'application/json'
        }
      })
      if (response.data) {
        res
          .status(200)
          .json({ playbackId: response.data?.asset?.playbackId, success: true })
      } else {
        res.status(200).json({ playbackId: null, success: false })
      }
    } catch (error) {
      res.status(200).json({ playbackId: null, success: false })
    }
  }
}

export default playback
