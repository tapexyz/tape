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
  if (req.method !== 'POST' || !req.body) {
    return res.status(405).json({ success: false })
  }
  try {
    const payload = req.body
    const headers = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${LIVEPEER_API_TOKEN}`
      }
    }
    const { data } = await axios.get(
      `https://livepeer.studio/api/asset?sourceUrl=${payload.sourceUrl}&phase=ready`,
      headers
    )
    if (data && data?.length) {
      const { data: views } = await axios.get(
        `https://livepeer.studio/api/data/views/${
          data[data.length - 1].id
        }/total`,
        headers
      )
      if (!views || !views?.length) {
        return res.status(200).json({ success: false, views: 0 })
      }
      return res.setHeader('Cache-Control', 's-maxage=100').status(200).json({
        success: true,
        views: views[0].startViews
      })
    }
    return res.status(200).json({ success: false, views: 0 })
  } catch (error) {
    logger.error('[API Error Video Views]', error)
    return res.status(200).json({ success: false })
  }
}

export default views
