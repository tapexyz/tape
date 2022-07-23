import * as Sentry from '@sentry/nextjs'
import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  playbackId: string | null
  success: boolean
}

const playback = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  // const origin = req.headers.origin
  // console.log('ORIGIN --->> ', origin)
  // if (!origin || origin !== 'https://lenstube.xyz')
  //   return res.status(401).json({ playbackId: null, success: false })
  if (req.method === 'POST') {
    try {
      const body = req.body
      if (!body.url)
        return res.status(200).json({ playbackId: null, success: false })
      const parsed = new URL(body.url)
      if (!parsed)
        return res.status(200).json({ playbackId: null, success: false })
      const splited = parsed.pathname.split('/')
      const name = splited[splited.length - 1]
      const livepeerKey = process.env.LIVEPEER_API_KEY
      const response: any = await axios({
        method: 'post',
        url: 'https://livepeer.studio/api/asset/import',
        data: {
          url: body.url,
          name
        },
        headers: {
          Authorization: `Bearer ${livepeerKey}`,
          'Content-Type': 'application/json'
        }
      })
      if (response.data) {
        return res.status(200).json({
          playbackId: response.data?.asset?.playbackId,
          success: true
        })
      } else {
        return res.status(200).json({ playbackId: null, success: false })
      }
    } catch (error) {
      return res.status(200).json({ playbackId: null, success: false })
    }
  }
}

export default Sentry.withSentry(playback)
