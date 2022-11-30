import getPublicationOembed from 'lib/getPublicationOembed'
import type { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') return res.status(405).json({ success: false })

  const format = req.query.format as string
  const videoId = req.query.id as string

  try {
    if (format === 'json') {
      return res.json(await getPublicationOembed(videoId, format))
    }

    if (format === 'xml') {
      return res
        .setHeader('Content-Type', 'application/xml')
        .send(await getPublicationOembed(videoId, format))
    }

    return null
  } catch (error) {
    return null
  }
}

export default handler
