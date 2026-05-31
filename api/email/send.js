import { sendTemplatedEmail } from '../../server/lib/sendEmail.js'

export default async function handler(req, res) {
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
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
    const { template, to, data, subject } = body

    const result = await sendTemplatedEmail({ template, to, data, subject })

    if (!result.ok && result.status === 400) {
      return res.status(400).json({ ok: false, error: result.error })
    }

    return res.status(result.httpStatus || 200).json({
      ok: result.ok,
      status: result.status,
      id: result.id,
      error: result.error,
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ ok: false, error: 'Server error' })
  }
}
