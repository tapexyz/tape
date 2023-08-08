import { createCors, error, json, Router } from 'itty-router'

import getListByAlgorithm from './getListByAlgorithm'
import type { Env } from './types'

const { preflight, corsify } = createCors({
  origins: ['*'],
  methods: ['HEAD', 'GET']
})

const router = Router()

router.all('*', preflight)
router.get('/', () => new Response('gm 👋'))
router.get('/:provider/:strategy/:limit/:offset', ({ params }) =>
  getListByAlgorithm(
    params.provider,
    params.strategy,
    params.limit,
    params.offset
  )
)

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
  fetch: (request: Request, env: Env, context: ExecutionContext) =>
    handleFetch(request, env, context).then(corsify)
}
