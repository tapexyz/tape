import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'

import getSvg from '../../../getSvg'

const PROFILE_QUERY = `
 query Profile($request: SingleProfileQueryRequest!) {
  profile(request: $request) {
    stats {
      totalFollowers
    }
  }
}
`

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { handle } = req.query

  try {
    const result = await axios('https://api.lens.dev', {
      method: 'POST',
      data: JSON.stringify({
        operationName: 'Profile',
        query: PROFILE_QUERY,
        variables: {
          request: { handle }
        }
      }),
      headers: { 'Content-Type': 'application/json' }
    })

    const { profile } = result?.data?.data
    res.setHeader('Cache-control', 'public, max-age=300')
    res.setHeader('Content-Type', 'image/svg+xml')
    return res.send(getSvg(profile.stats.totalFollowers))
  } catch (error) {
    return res.send(getSvg(0))
  }
}
