import { createCors, error, Router, status } from 'itty-router'

import type { Env } from './types'
import buildRequest from './helper/buildRequest'
import getUnlonelyStream from './handlers/getUnlonelyStream'
import getRadStream from './handlers/getRadStream'

const { preflight, corsify } = createCors({
  origins: ['*'],
  methods: ['HEAD', 'GET']
})

const router = Router()

router
  .all('*', preflight)
  .head('*', () => status(200))
  .get('/', () => new Response('gm 👋'))
  .get('/unlonely/:channel?', ({ params }) => getUnlonelyStream(params.channel))
  .get('/rad', () => getRadStream())
  .all('*', () => error(404))

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const incomingRequest = buildRequest(request, env, ctx)

    return await router
      .handle(incomingRequest)
      .then(corsify)
      .catch(() => {
        return error(500, 'Server error')
      })
  }
}
