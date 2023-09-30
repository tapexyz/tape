import { createCors, error, json, Router, status } from 'itty-router'

import type { Env } from './types'
import getNfts from './handlers/getNfts'
import buildRequest from './helper/buildRequest'
import getZoraNft from './handlers/getZoraNft'

const { preflight, corsify } = createCors({
  origins: ['*'],
  methods: ['HEAD', 'GET']
})

const router = Router()

router
  .all('*', preflight)
  .head('*', () => status(200))
  .get('/', () => new Response('gm 👋'))
  .get('/zora', getZoraNft)
  .get('/:handle/:limit/:cursor?', ({ params }, env) =>
    getNfts(env, params.handle, params.limit)
  )
  .all('*', () => error(404))

const routerHandleStack = (request: Request, env: Env, ctx: ExecutionContext) =>
  router.handle(request, env, ctx).then(json)

const handleFetch = async (
  request: Request,
  env: Env,
  ctx: ExecutionContext
) => {
  try {
    return await routerHandleStack(request, env, ctx)
  } catch {
    return error(500)
  }
}

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
