import axios from 'axios'
import { json, urlencoded } from 'body-parser'
import cors from 'cors'
import express from 'express'

import getSvg from './getSvg'

const PROFILE_QUERY = `
 query Profile($request: SingleProfileQueryRequest!) {
  profile(request: $request) {
    stats {
      totalFollowers
    }
  }
}
`

export const createServer = () => {
  const app = express()
  app
    .disable('x-powered-by')
    .use(urlencoded({ extended: true }))
    .use(json())
    .use(cors())
    .get('/lens/:handle', async (req, res) => {
      const { handle } = req.params

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
    })

  return app
}
