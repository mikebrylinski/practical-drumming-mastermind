import { persistContact } from '../server/lib/persistContact.js'
import { verifyRecaptcha } from '../server/lib/verifyRecaptcha.js'

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
    const { recaptchaToken, ...body } = req.body ?? {}
    const captcha = await verifyRecaptcha(recaptchaToken, {
      remoteip: req.headers['x-forwarded-for'],
    })
    if (!captcha.ok) {
      return res.status(400).json({ ok: false, error: captcha.error })
    }
    const contact = persistContact(body)
    console.log('[POST /api/contact]', JSON.stringify(contact, null, 2))
    return res.status(201).json({ ok: true })
  } catch (err) {
    if (err.status === 400) {
      return res.status(400).json({ ok: false, error: err.message })
    }
    console.error(err)
    return res.status(500).json({ ok: false, error: 'Server error' })
  }
}
