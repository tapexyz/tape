import { gql } from '@apollo/client'
import { nodeClient } from '@lib/apollo'
import { withSentry } from '@sentry/nextjs'
import { ERROR_MESSAGE } from '@utils/constants'
import { NextApiRequest, NextApiResponse } from 'next'

const PING_QUERY = gql`
  query Ping {
    ping
  }
`

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { data, networkStatus } = await nodeClient.query({
      query: PING_QUERY
    })

    return res
      .status(networkStatus === 7 ? 200 : 500)
      .json({ success: networkStatus === 7, ping: data?.ping })
  } catch (e) {
    return res.status(500).json({ success: false, message: ERROR_MESSAGE })
  }
}

export default withSentry(handler)
