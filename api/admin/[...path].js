import adminMembersCreateHandler from '../../server/lib/routes/adminMembersCreate.js'
import adminBookingsCreateHandler from '../../server/lib/routes/adminBookingsCreate.js'
import adminBookingsUpdateHandler from '../../server/lib/routes/adminBookingsUpdate.js'
import adminContactsHandler from '../../server/lib/routes/adminContacts.js'

// Single function for all /api/admin/* routes to stay under the Vercel Hobby
// 12-serverless-function limit.
export default async function handler(req, res) {
  const parts = Array.isArray(req.query?.path)
    ? req.query.path
    : [req.query?.path].filter(Boolean)
  const route = parts.join('/')

  switch (route) {
    case 'members/create':
      return adminMembersCreateHandler(req, res)
    case 'bookings/create':
      return adminBookingsCreateHandler(req, res)
    case 'bookings/update':
      return adminBookingsUpdateHandler(req, res)
    case 'contacts':
      return adminContactsHandler(req, res)
    default:
      return res.status(404).json({ ok: false, error: 'Unknown admin route' })
  }
}
