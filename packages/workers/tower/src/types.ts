import type { IRequestStrict } from 'itty-router'

export interface Env {
  INGEST_REST_ENDPOINT: string
  IP_API_KEY: string
}

export type WorkerRequest = {
  req: Request
  env: Env
  ctx: ExecutionContext
} & IRequestStrict
