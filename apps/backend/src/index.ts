import { Hono } from 'hono'

import sts from './routes/sts'
import tail from './routes/tail'
import tower from './routes/tower'

const app = new Hono()

app.get('/', (c) => c.text('tape.xyz'))

app.route('/sts', sts)
app.route('/tail', tail)
app.route('/tower', tower)

export default app
