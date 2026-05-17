import { persistApplication } from '../lib/persistApplication.js'

export default function applyHandler(req, res) {
  try {
    const application = persistApplication(req.body)
    console.log('[POST /api/apply]', JSON.stringify(application, null, 2))
    res.status(201).json({ ok: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ ok: false, error: 'Server error' })
  }
}
