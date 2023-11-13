import type { IRequestStrict } from 'itty-router'

export interface Env {}

export type WorkerRequest = {
  req: Request
  env: Env
  ctx: ExecutionContext
} & IRequestStrict
