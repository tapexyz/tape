import Bundlr from '@bundlr-network/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import {
  BUNDLR_CURRENCY,
  BUNDLR_METADATA_UPLOAD_URL,
  BUNDLR_PRIVATE_KEY,
  LENSTUBE_APP_NAME
} from 'utils'
import logger from 'utils/logger'

type Data = {
  success: boolean
  url?: string
  id?: string
  node?: string
}

const upload = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }
  if (req.method !== 'POST' || !req.body) {
    return res.status(400).json({ success: false })
  }
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
    return res.status(500).json({ success: false })
  }
}

export default upload
