import recordingsListHandler from '../../server/lib/routes/recordingsList.js'
import recordingsUpdateHandler from '../../server/lib/routes/recordingsUpdate.js'

const routes = {
  list: recordingsListHandler,
  update: recordingsUpdateHandler,
}

export default async function handler(req, res) {
  const route = routes[req.query?.action]
  if (!route) {
    return res.status(404).json({ ok: false, error: 'Unknown recording action' })
  }
  return route(req, res)
}
