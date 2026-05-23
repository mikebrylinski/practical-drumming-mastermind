import { persistContact } from '../lib/persistContact.js'

export default function contactHandler(req, res) {
  try {
    const contact = persistContact(req.body)
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
