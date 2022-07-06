import * as Sentry from '@sentry/nextjs'
import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'

const livepeerKey = process.env.LIVEPEER_API_KEY

const errorResponse = {
  success: false
}

const newStream = async (req: NextApiRequest, res: NextApiResponse) => {
  return res.json(errorResponse)
  if (req.method === 'POST') {
    try {
      const body = req.body
      if (!body.name) res.status(200).json(errorResponse)
      const response: any = await axios({
        method: 'post',
        url: 'https://livepeer.studio/api/stream',
        data: {
          name: body.name,
          profiles: [
            {
              name: '720p',
              bitrate: 2000000,
              fps: 30,
              width: 1280,
              height: 720
            },
            {
              name: '480p',
              bitrate: 1000000,
              fps: 30,
              width: 854,
              height: 480
            },
            {
              name: '360p',
              bitrate: 500000,
              fps: 30,
              width: 640,
              height: 360
            }
          ]
        },
        headers: {
          Authorization: `Bearer ${livepeerKey}`,
          'Content-Type': 'application/json'
        }
      })
      if (response.data) {
        const { playbackId, streamKey, id } = response.data
        res.status(200).json({
          playbackId,
          streamKey,
          streamId: id,
          success: true
        })
      } else {
        res.status(200).json(errorResponse)
        Sentry.captureException(response)
      }
    } catch (error) {
      res.status(200).json(errorResponse)
      Sentry.captureException(error)
    }
  }
  if (req.method === 'GET') {
    try {
      const query = req.query
      if (!query.id) res.status(200).json(errorResponse)
      const response: any = await axios({
        method: 'get',
        url: `https://livepeer.studio/api/stream/${query.id}`,
        headers: {
          Authorization: `Bearer ${livepeerKey}`,
          'Content-Type': 'application/json'
        }
      })
      if (response.data) {
        const { isActive } = response.data
        res.status(200).json({
          isActive,
          success: true
        })
      } else {
        res.status(200).json(errorResponse)
      }
    } catch (error) {
      res.status(200).json(errorResponse)
    }
  }
}

export default newStream
