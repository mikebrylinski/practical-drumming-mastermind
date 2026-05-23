import express from 'express'
import cors from 'cors'
import applyHandler from './routes/apply.js'
import contactHandler from './routes/contact.js'

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
    allowedHeaders: ['Content-Type'],
  }),
)
app.use(express.json({ limit: '256kb' }))

app.post('/api/apply', applyHandler)
app.post('/api/contact', contactHandler)

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
