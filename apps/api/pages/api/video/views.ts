import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'
import { LIVEPEER_API_TOKEN } from 'utils'
import logger from 'utils/logger'

type Data = {
  views?: number
  success: boolean
}

const views = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }
  // const origin = req.headers.origin
  // if (IS_MAINNET && (!origin || !API_ORIGINS.includes(origin))) {
  //   logger.error('[API INVALID ORIGIN]', origin)
  //   return res.status(403).json({ success: false })
  // }
  if (req.method !== 'POST' || !req.body)
    return res.status(400).json({ success: false })
  try {
    const payload = req.body
    const headers = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${LIVEPEER_API_TOKEN}`
      }
    }
    const { data } = await axios.get(
      `https://livepeer.studio/api/asset?sourceUrl=${payload.sourceUrl}&phase=ready&limit=1`,
      headers
    )
    if (data && data[0]) {
      const { data: views } = await axios.get(
        `https://livepeer.studio/api/data/views/${data[0].id}/total`,
        headers
      )
      if (!views || !views[0]) {
        return res.status(200).json({ success: false })
      }
      return res.setHeader('Cache-Control', 's-maxage=60').status(200).json({
        success: true,
        views: views[0].startViews
      })
    }
    return res.status(200).json({ success: false })
  } catch (error) {
    logger.error('[API Error Video Views]', error)
    return res.status(200).json({ success: false })
  }
}

export default views
