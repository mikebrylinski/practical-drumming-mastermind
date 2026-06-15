import bookingsCreateHandler from '../../server/lib/routes/bookingsCreate.js'
import bookingsCancelHandler from '../../server/lib/routes/bookingsCancel.js'

const routes = {
  create: bookingsCreateHandler,
  cancel: bookingsCancelHandler,
}

export default async function handler(req, res) {
  const route = routes[req.query?.action]
  if (!route) {
    return res.status(404).json({ ok: false, error: 'Unknown booking action' })
  }
  return route(req, res)
}
