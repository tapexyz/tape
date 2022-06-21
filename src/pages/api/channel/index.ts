import { nodeClient } from '@lib/apollo'
import { ERROR_MESSAGE } from '@utils/constants'
import { OG_PROFILE_QUERY } from '@utils/gql/queries'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { name } = req.query
    if (!name)
      return res
        .status(200)
        .json({ success: false, message: 'Channel name required' })
    const { data } = await nodeClient.query({
      query: OG_PROFILE_QUERY,
      variables: { request: { handle: name } }
    })
    if (data?.profile) {
      res.setHeader('Cache-Control', 's-maxage=86400')
      return res.status(200).json({ success: true, channel: data?.profile })
    } else {
      return res
        .status(404)
        .json({ success: false, message: 'No channel found' })
    }
  } catch (e) {
    return res.status(200).json({ success: false, message: ERROR_MESSAGE })
  }
}
