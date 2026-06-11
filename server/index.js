import express from 'express'
import cors from 'cors'
import contactHandler from './routes/contact.js'
// Vercel serverless functions reused directly for local dev parity.
import applyHandler from '../api/apply.js'
import leadsEventHandler from '../api/leads/event.js'
import emailSendHandler from '../api/email/send.js'
import bookingsCreateHandler from '../api/bookings/create.js'
import bookingsCancelHandler from '../api/bookings/cancel.js'
import livekitTokenHandler from '../api/livekit/token.js'
import livekitEgressStartHandler from '../server/lib/livekit/egress/start.js'
import livekitEgressStopHandler from '../server/lib/livekit/egress/stop.js'
import livekitEgressStatusHandler from '../server/lib/livekit/egress/status.js'
import livekitEgressWebhookHandler from '../server/lib/livekit/egress/webhook.js'
import recordingsListHandler from '../api/recordings/list.js'
import crmActionHandler from '../api/crm/action.js'

const app = express()
const PORT = Number(process.env.API_PORT) || 3003

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
  ...(process.env.ALLOWED_ORIGIN ? [process.env.ALLOWED_ORIGIN] : []),
]

app.use(
  cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Demo-Admin'],
  }),
)
app.use(express.json({ limit: '256kb' }))

app.post('/api/apply', applyHandler)
app.post('/api/contact', contactHandler)
app.post('/api/leads/event', leadsEventHandler)
app.post('/api/email/send', emailSendHandler)
app.post('/api/bookings/create', bookingsCreateHandler)
app.post('/api/bookings/cancel', bookingsCancelHandler)
app.post('/api/livekit/token', livekitTokenHandler)
app.get('/api/livekit/token', livekitTokenHandler)
app.post('/api/livekit/egress/start', livekitEgressStartHandler)
app.post('/api/livekit/egress/stop', livekitEgressStopHandler)
app.get('/api/livekit/egress/status', livekitEgressStatusHandler)
app.post('/api/livekit/egress/webhook', livekitEgressWebhookHandler)
app.get('/api/recordings/list', recordingsListHandler)
app.post('/api/crm/action', crmActionHandler)

const server = app.listen(PORT, () => {
  console.log(`Practical Drumming API listening on http://localhost:${PORT}`)
})

server.on('error', (err) => {
  console.error('[api] server error', err)
  process.exitCode = 1
})

// In some dev environments, the event loop can appear idle immediately after listen().
// Keeping stdin resumed ensures the dev process stays alive.
process.stdin.resume()
