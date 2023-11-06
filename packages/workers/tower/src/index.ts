import { createCors, error, Router, status } from 'itty-router'

import ingest from './handlers/ingest'
import buildRequest from './helpers/buildRequest'
import type { Env } from './types'

const { preflight, corsify } = createCors({
  origins: ['*'],
  methods: ['HEAD', 'GET', 'POST']
})

const router = Router()

router
  .all('*', preflight)
  .head('*', () => status(200))
  .get('/', () => new Response('gm'))
  .post('/ingest', ingest)
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
