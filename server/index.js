import express from 'express'
import cors from 'cors'
import contactHandler from './routes/contact.js'
import applyHandler from '../api/apply.js'
import leadsEventHandler from '../api/leads/event.js'
import emailSendHandler from '../api/email/send.js'
import bookingsCreateHandler from './lib/routes/bookingsCreate.js'
import bookingsCancelHandler from './lib/routes/bookingsCancel.js'
import livekitTokenHandler from './lib/routes/livekitToken.js'
import livekitRoomInfoHandler from './lib/routes/livekitRoomInfo.js'
import livekitEgressStartHandler from './lib/livekit/egress/start.js'
import livekitEgressStopHandler from './lib/livekit/egress/stop.js'
import livekitEgressStatusHandler from './lib/livekit/egress/status.js'
import livekitEgressWebhookHandler from './lib/livekit/egress/webhook.js'
import recordingsListHandler from './lib/routes/recordingsList.js'
import crmActionHandler from '../api/crm/action.js'
import adminMembersCreateHandler from './lib/routes/adminMembersCreate.js'
import adminContactsHandler from './lib/routes/adminContacts.js'
import adminBookingsCreateHandler from './lib/routes/adminBookingsCreate.js'
import adminBookingsUpdateHandler from './lib/routes/adminBookingsUpdate.js'
import recordingsUpdateHandler from './lib/routes/recordingsUpdate.js'
import communityPostsHandler from './lib/routes/communityPosts.js'
import communityRepliesHandler from './lib/routes/communityReplies.js'

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
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
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
app.get('/api/livekit/room-info', livekitRoomInfoHandler)
app.post('/api/livekit/egress/start', livekitEgressStartHandler)
app.post('/api/livekit/egress/stop', livekitEgressStopHandler)
app.get('/api/livekit/egress/status', livekitEgressStatusHandler)
app.post('/api/livekit/egress/webhook', livekitEgressWebhookHandler)
app.get('/api/recordings/list', recordingsListHandler)
app.patch('/api/recordings/update', recordingsUpdateHandler)
app.post('/api/crm/action', crmActionHandler)
app.post('/api/admin/members/create', adminMembersCreateHandler)
app.get('/api/admin/contacts', adminContactsHandler)
app.post('/api/admin/contacts', adminContactsHandler)
app.delete('/api/admin/contacts', adminContactsHandler)
app.post('/api/admin/bookings/create', adminBookingsCreateHandler)
app.patch('/api/admin/bookings/update', adminBookingsUpdateHandler)
app.get('/api/community/posts', communityPostsHandler)
app.post('/api/community/posts', communityPostsHandler)
app.delete('/api/community/posts', communityPostsHandler)
app.get('/api/community/replies', communityRepliesHandler)
app.post('/api/community/replies', communityRepliesHandler)
app.delete('/api/community/replies', communityRepliesHandler)

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
