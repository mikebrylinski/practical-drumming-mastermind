import livekitTokenHandler from '../../server/lib/routes/livekitToken.js'
import livekitRoomInfoHandler from '../../server/lib/routes/livekitRoomInfo.js'

const routes = {
  token: livekitTokenHandler,
  'room-info': livekitRoomInfoHandler,
}

function resolveRouteKey(req) {
  const pathname = String(req.url || '').split('?')[0]
  const prefix = '/api/livekit/'
  if (pathname.startsWith(prefix)) {
    const route = pathname.slice(prefix.length).replace(/\/$/, '')
    if (route && !route.includes('/')) return decodeURIComponent(route)
  }

  const segments = req.query?.path
  const routeKey = Array.isArray(segments) ? segments.join('/') : String(segments || '')
  return routeKey.includes('/') ? '' : routeKey
}

export default async function handler(req, res) {
  const route = routes[resolveRouteKey(req)]
  if (!route) {
    return res.status(404).json({ ok: false, error: 'Unknown livekit route' })
  }
  return route(req, res)
}
