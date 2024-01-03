import { Hono } from 'hono'
import { cors } from 'hono/cors'

import did from './routes/did'
import gateway from './routes/gateway'
import metadata from './routes/metadata'
import oembed from './routes/oembed'
import recommendations from './routes/recommendations'
import sts from './routes/sts'
import tail from './routes/tail'
import tower from './routes/tower'
import verified from './routes/verified'
import views from './routes/views'

const app = new Hono()

const corsConfig = {
  origin: ['https://tape.xyz', '*.tape.xyz'],
  allowHeaders: ['*'],
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  maxAge: 600
}
app.use('*', cors(corsConfig))

app.get('/', (c) => c.text('tape.xyz'))

app.route('/did', did)
app.route('/sts', sts)
app.route('/tail', tail)
app.route('/tower', tower)
app.route('/views', views)
app.route('/oembed', oembed)
app.route('/gateway', gateway)
app.route('/metadata', metadata)
app.route('/verified', verified)
app.route('/recommendations', recommendations)

export default app
