import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'
import { BETTER_UPTIME_KEY } from 'utils'

type Monitor = {
  id: string
  attributes: {
    status: string
  }
}

const health = async (_req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { data: response } = await axios.get(
      'https://betteruptime.com/api/v2/monitors',
      {
        headers: {
          Authorization: `Bearer ${BETTER_UPTIME_KEY}`
        }
      }
    )
    const monitors: Monitor[] = response.data
    const incidents = monitors.filter(
      (m: Monitor) => m.attributes.status !== 'up'
    )
    return res.status(200).json({ ok: !incidents.length })
  } catch (error) {
    return res.status(500).json({ ok: false })
  }
}

export default health
