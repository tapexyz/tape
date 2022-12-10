import Bundlr from '@bundlr-network/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import {
  API_ORIGINS,
  BUNDLR_CURRENCY,
  BUNDLR_METADATA_UPLOAD_URL,
  BUNDLR_PRIVATE_KEY,
  IS_MAINNET,
  LENSTUBE_APP_NAME
} from 'utils'
import logger from 'utils/logger'

type Data = {
  url: string | null
  id: string | null
  node?: string
  success: boolean
}

const upload = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }
  const origin = req.headers.origin
  if (IS_MAINNET && (!origin || !API_ORIGINS.includes(origin))) {
    return res.status(403).json({ url: null, id: null, success: false })
  }
  if (req.method !== 'POST' || !req.body)
    return res.status(400).json({ url: null, id: null, success: false })
  try {
    const payload = JSON.stringify(req.body)
    const bundlr = new Bundlr(
      BUNDLR_METADATA_UPLOAD_URL,
      BUNDLR_CURRENCY,
      BUNDLR_PRIVATE_KEY
    )
    const tags = [
      { name: 'Content-Type', value: 'application/json' },
      { name: 'App-Name', value: LENSTUBE_APP_NAME }
    ]
    const { id } = await bundlr.upload(payload, {
      tags
    })
    return res.status(200).json({
      success: true,
      url: `https://arweave.net/${id}`,
      id,
      node: BUNDLR_METADATA_UPLOAD_URL
    })
  } catch (error) {
    logger.error('[API Error Upload to Arweave]', error)
    return res.status(200).json({ success: false, url: null, id: null })
  }
}

export default upload
