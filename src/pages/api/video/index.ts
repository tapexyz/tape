import { nodeClient } from '@lib/apollo'
import { ERROR_MESSAGE } from '@utils/constants'
import { OG_VIDEO_DETAIL_QUERY } from '@utils/gql/queries'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { id } = req.query

    if (!id)
      return res
        .status(200)
        .json({ success: false, message: 'Video ID required' })

    const { data } = await nodeClient.query({
      query: OG_VIDEO_DETAIL_QUERY,
      variables: { request: { publicationId: id } }
    })
    if (data?.publication) {
      res.setHeader('Cache-Control', 's-maxage=31536000')
      return res.status(200).json({ success: true, video: data?.publication })
    } else {
      return res.status(404).json({ success: false, message: 'No video found' })
    }
  } catch (e) {
    return res.status(500).json({ success: false, message: ERROR_MESSAGE })
  }
}
