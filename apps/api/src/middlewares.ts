import crypto from 'crypto'
import type { Context, HonoRequest, Next } from 'hono'
import { cors as corsMiddleware } from 'hono/cors'
import { rateLimiter as rateLimiterMiddleware } from 'hono-rate-limiter'

const allowedOrigins = [
  'https://tape.xyz',
  'https://www.tape.xyz',
  'https://embed.tape.xyz',
  'https://og.tape.xyz'
]

const getIp = (req: HonoRequest) =>
  req.header('x-forwarded-for') || req.header('remote-addr')

export const ipRestriction = async (c: Context, next: Next) => {
  const origin = c.req.header('Origin')
  const ip = getIp(c.req)
  console.info(
    `[${c.req.method}] method from [${origin}] with ip [${ip}] to [${c.req.path}]`
  )
  //   if (origin && !allowedOrigins.includes(origin)) {
  //     return c.text('Forbidden', 403)
  //   }
  await next()
}

export const ratelimiter = rateLimiterMiddleware({
  windowMs: 5 * 60 * 1000, // 5 minutes
  limit: 100, // Limit each IP to 100 requests per `window`
  message: 'Hold on, too many requests!',
  standardHeaders: true,
  keyGenerator: (c) => {
    const { path } = c.req
    const ip = getIp(c.req)
    return crypto.createHash('sha256').update(`${path}:${ip}`).digest('hex')
  }
})

export const cors = corsMiddleware({
  origin: allowedOrigins,
  allowMethods: ['GET', 'POST', 'OPTIONS']
})
