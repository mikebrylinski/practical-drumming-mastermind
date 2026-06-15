import startHandler from '../../../server/lib/livekit/egress/start.js'
import stopHandler from '../../../server/lib/livekit/egress/stop.js'
import statusHandler from '../../../server/lib/livekit/egress/status.js'
import webhookHandler from '../../../server/lib/livekit/egress/webhook.js'

const routes = {
  start: startHandler,
  stop: stopHandler,
  status: statusHandler,
  webhook: webhookHandler,
}

export default async function handler(req, res) {
  const route = routes[req.query?.action]
  if (!route) {
    return res.status(404).json({ ok: false, error: 'Unknown egress action' })
  }
  return route(req, res)
}
