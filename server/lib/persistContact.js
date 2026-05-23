import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export function getContactsPath() {
  if (process.env.CONTACTS_PATH) {
    return process.env.CONTACTS_PATH
  }
  if (process.env.VERCEL) {
    return '/tmp/contacts.json'
  }
  return path.join(__dirname, '..', '..', 'data', 'contacts.json')
}

export function persistContact(body) {
  const name = String(body?.name ?? '').trim()
  const email = String(body?.email ?? '').trim()
  const message = String(body?.message ?? '').trim()

  if (!name || !email || !message) {
    const err = new Error('Name, email, and message are required')
    err.status = 400
    throw err
  }

  const contact = {
    name,
    email,
    message,
    submittedAt: new Date().toISOString(),
  }

  const dataPath = getContactsPath()
  let contacts = []

  try {
    const raw = fs.readFileSync(dataPath, 'utf8')
    contacts = JSON.parse(raw)
  } catch {
    contacts = []
  }
  if (!Array.isArray(contacts)) contacts = []

  contacts.push(contact)
  fs.mkdirSync(path.dirname(dataPath), { recursive: true })
  fs.writeFileSync(dataPath, JSON.stringify(contacts, null, 2))

  return contact
}
