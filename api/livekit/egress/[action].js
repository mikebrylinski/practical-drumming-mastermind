import startHandler from './handlers/start.js'
import stopHandler from './handlers/stop.js'
import statusHandler from './handlers/status.js'
import webhookHandler from './handlers/webhook.js'

const routes = {
  start: startHandler,
  stop: stopHandler,
  status: statusHandler,
  webhook: webhookHandler,
}

export default async function handler(req, res) {
  const action = req.query?.action
  const route = routes[action]
  if (!route) {
    return res.status(404).json({ ok: false, error: 'Unknown egress action' })
  }
  return route(req, res)
}
