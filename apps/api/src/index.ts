import 'dotenv/config'

import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'

import allowedTokens from './routes/allowed-tokens'
import avatar from './routes/avatar'
import did from './routes/did'
import gateway from './routes/gateway'
import metadata from './routes/metadata'
import oembed from './routes/oembed'
import sts from './routes/sts'
import tail from './routes/tail'
import toggles from './routes/toggles'
import tower from './routes/tower'
import verified from './routes/verified'
import views from './routes/views'

const app = new Hono()

app.use('*', cors())

app.get('/', (c) => c.text('tape.xyz'))

app.route('/did', did)
app.route('/sts', sts)
app.route('/tail', tail)
app.route('/tower', tower)
app.route('/views', views)
app.route('/oembed', oembed)
app.route('/avatar', avatar)
app.route('/gateway', gateway)
app.route('/toggles', toggles)
app.route('/metadata', metadata)
app.route('/verified', verified)
app.route('/allowed-tokens', allowedTokens)

serve(app, (info) => {
  console.log(`API listening on http://localhost:${info.port}`)
})
