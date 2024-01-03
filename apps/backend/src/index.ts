import { Hono } from 'hono'

import did from './routes/did'
import metadata from './routes/metadata'
import recommendations from './routes/recommendations'
import sts from './routes/sts'
import tail from './routes/tail'
import tower from './routes/tower'

const app = new Hono()

app.get('/', (c) => c.text('tape.xyz'))

app.route('/sts', sts)
app.route('/tail', tail)
app.route('/tower', tower)
app.route('/did', did)
app.route('/metadata', metadata)
app.route('/recommendations', recommendations)

export default app
