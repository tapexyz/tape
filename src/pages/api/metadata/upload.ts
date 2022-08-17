import Bundlr from '@bundlr-network/client'
import { withSentry } from '@sentry/nextjs'
import {
  API_ORIGINS,
  APP_NAME,
  BUNDLR_CURRENCY,
  BUNDLR_NODE_2_URL
} from '@utils/constants'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  url: string | null
  id: string | null
  success: boolean
}

const PRIVATE_KEY = process.env.PRIVATE_KEY_FOR_BUNDLR

const upload = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const origin = req.headers.origin
  if (!origin || !API_ORIGINS.includes(origin))
    return res.status(401).json({ url: null, id: null, success: false })
  if (req.method !== 'POST' || !req.body)
    return res.status(400).json({ success: false, url: null, id: null })
  const jsonString = JSON.stringify(req.body)
  try {
    const bundlr = new Bundlr(BUNDLR_NODE_2_URL, BUNDLR_CURRENCY, PRIVATE_KEY)
    const tags = [
      { name: 'Content-Type', value: 'application/json' },
      { name: 'App-Name', value: APP_NAME }
    ]
    const uploader = bundlr.uploader.chunkedUploader
    const result = await uploader.uploadData(Buffer.from(jsonString), { tags })
    const id = result.data.id
    return res.status(200).json({
      success: true,
      url: `https://arweave.net/${id}`,
      id
    })
  } catch (error) {
    return res.status(200).json({ success: false, url: null, id: null })
  }
}

export default withSentry(upload)
