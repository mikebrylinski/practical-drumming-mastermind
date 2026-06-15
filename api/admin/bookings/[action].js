import adminBookingsCreateHandler from '../../../server/lib/routes/adminBookingsCreate.js'
import adminBookingsUpdateHandler from '../../../server/lib/routes/adminBookingsUpdate.js'

const routes = {
  create: adminBookingsCreateHandler,
  update: adminBookingsUpdateHandler,
}

export default async function handler(req, res) {
  const route = routes[req.query?.action]
  if (!route) {
    return res.status(404).json({ ok: false, error: 'Unknown admin bookings route' })
  }
  return route(req, res)
}
