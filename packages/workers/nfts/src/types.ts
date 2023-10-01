import { IRequestStrict } from 'itty-router'

export interface Env {
  API_KEY: string
  API_URL: string
}

export type WorkerRequest = {
  req: Request
  env: Env
  ctx: ExecutionContext
} & IRequestStrict
