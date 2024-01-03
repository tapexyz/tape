import { Hono } from 'hono'

import sts from './routes/sts'
import tail from './routes/tail'

const app = new Hono()

app.get('/', (c) => c.text('tape.xyz'))

app.route('/sts', sts)
app.route('/tail', tail)

export default app
