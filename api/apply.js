import { persistApplication } from '../server/lib/persistApplication.js'

export default function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    return res.status(204).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  try {
    const application = persistApplication(req.body)
    console.log('[POST /api/apply]', JSON.stringify(application, null, 2))
    return res.status(201).json({ ok: true })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ ok: false, error: 'Server error' })
  }
}
