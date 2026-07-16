import adminMembersCreateHandler from '../../server/lib/routes/adminMembersCreate.js'
import adminBookingsCreateHandler from '../../server/lib/routes/adminBookingsCreate.js'
import adminBookingsUpdateHandler from '../../server/lib/routes/adminBookingsUpdate.js'
import adminContactsHandler from '../../server/lib/routes/adminContacts.js'
import adminAnalyticsHandler from '../../server/lib/routes/adminAnalytics.js'

// Single function for all /api/admin/* routes to stay under the Vercel Hobby
// 12-serverless-function limit.
function resolveAdminRoute(req) {
  const pathname = String(req.url || '').split('?')[0]
  const prefix = '/api/admin/'
  if (pathname.startsWith(prefix)) {
    const route = pathname.slice(prefix.length).replace(/\/$/, '')
    if (route) return decodeURIComponent(route)
  }

  const parts = Array.isArray(req.query?.path)
    ? req.query.path
    : [req.query?.path].filter(Boolean)
  return parts.join('/')
}

export default async function handler(req, res) {
  const route = resolveAdminRoute(req)

  switch (route) {
    case 'members/create':
      return adminMembersCreateHandler(req, res)
    case 'bookings/create':
      return adminBookingsCreateHandler(req, res)
    case 'bookings/update':
      return adminBookingsUpdateHandler(req, res)
    case 'contacts':
      return adminContactsHandler(req, res)
    case 'analytics':
      return adminAnalyticsHandler(req, res)
    default:
      return res.status(404).json({ ok: false, error: 'Unknown admin route' })
  }
}
