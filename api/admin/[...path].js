import adminMembersCreateHandler from '../../server/lib/routes/adminMembersCreate.js'
import adminBookingsCreateHandler from '../../server/lib/routes/adminBookingsCreate.js'
import adminBookingsUpdateHandler from '../../server/lib/routes/adminBookingsUpdate.js'

const routes = {
  'members/create': adminMembersCreateHandler,
  'bookings/create': adminBookingsCreateHandler,
  'bookings/update': adminBookingsUpdateHandler,
}

export default async function handler(req, res) {
  const segments = req.query?.path
  const routeKey = Array.isArray(segments) ? segments.join('/') : String(segments || '')
  const route = routes[routeKey]
  if (!route) {
    return res.status(404).json({ ok: false, error: 'Unknown admin route' })
  }
  return route(req, res)
}
