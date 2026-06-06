import { persistContact } from '../lib/persistContact.js'
import { verifyRecaptcha } from '../lib/verifyRecaptcha.js'

export default async function contactHandler(req, res) {
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
    res.status(201).json({ ok: true })
  } catch (err) {
    if (err.status === 400) {
      return res.status(400).json({ ok: false, error: err.message })
    }
    console.error(err)
    res.status(500).json({ ok: false, error: 'Server error' })
  }
}
