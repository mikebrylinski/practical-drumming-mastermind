import livekitTokenHandler from '../../server/lib/routes/livekitToken.js'
import livekitRoomInfoHandler from '../../server/lib/routes/livekitRoomInfo.js'
import egressStartHandler from '../../server/lib/livekit/egress/start.js'
import egressStopHandler from '../../server/lib/livekit/egress/stop.js'
import egressStatusHandler from '../../server/lib/livekit/egress/status.js'
import egressWebhookHandler from '../../server/lib/livekit/egress/webhook.js'

const routes = {
  token: livekitTokenHandler,
  'room-info': livekitRoomInfoHandler,
  'egress/start': egressStartHandler,
  'egress/stop': egressStopHandler,
  'egress/status': egressStatusHandler,
  'egress/webhook': egressWebhookHandler,
}

export default async function handler(req, res) {
  const segments = req.query?.path
  const routeKey = Array.isArray(segments) ? segments.join('/') : String(segments || '')
  const route = routes[routeKey]
  if (!route) {
    return res.status(404).json({ ok: false, error: 'Unknown livekit route' })
  }
  return route(req, res)
}
