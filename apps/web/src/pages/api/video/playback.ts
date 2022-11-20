import logger from '@lib/logger'
import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'
import { API_ORIGINS, IS_MAINNET, LIVEPEER_API_KEY } from 'utils'

type Data = {
  playbackId: string | null
  success: boolean
}

const playback = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const origin = req.headers.origin
  if (!IS_MAINNET || !origin || !API_ORIGINS.includes(origin)) {
    return res.status(403).json({ playbackId: null, success: false })
  }
  if (req.method !== 'POST' || !req.body) {
    return res.status(400).json({ playbackId: null, success: false })
  }
  const body = req.body
  if (!body.url) {
    return res.status(400).json({ playbackId: null, success: false })
  }
  const parsed = new URL(body.url)
  if (!parsed) {
    return res.status(400).json({ playbackId: null, success: false })
  }

  try {
    const splited = parsed.pathname.split('/')
    const name = splited[splited.length - 1]
    const response: any = await axios({
      method: 'post',
      url: 'https://livepeer.studio/api/asset/import',
      data: {
        url: body.url,
        name
      },
      headers: {
        Authorization: `Bearer ${LIVEPEER_API_KEY}`,
        'Content-Type': 'application/json'
      }
    })
    if (!response.data)
      return res.status(200).json({ playbackId: null, success: false })
    return res.status(200).json({
      playbackId: response.data?.asset?.playbackId,
      success: true
    })
  } catch (error) {
    logger.error('[API Error Get Playack from URL]', error)
    return res.status(200).json({ playbackId: null, success: false })
  }
}

export default playback
