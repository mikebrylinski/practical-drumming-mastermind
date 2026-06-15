import adminMembersCreateHandler from '../../../server/lib/routes/adminMembersCreate.js'

const routes = {
  create: adminMembersCreateHandler,
}

export default async function handler(req, res) {
  const route = routes[req.query?.action]
  if (!route) {
    return res.status(404).json({ ok: false, error: 'Unknown admin members route' })
  }
  return route(req, res)
}
